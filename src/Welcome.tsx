import { useContext, useMemo, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { UserContext } from "./App";
import Dialog from "./Dialog";
import { supaClient } from "./supa-client";

export async function welcomeLoader() {
  const {
    data: { user },
  } = await supaClient.auth.getUser();
  if (!user) {
    return redirect("/");
  }
  const { data } = await supaClient
    .from("user_profiles")
    .select("*")
    .eq("user_id", user?.id)
    .single();
  if (data?.username) {
    return redirect("/");
  }
}

export function Welcome() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [serverError, setServerError] = useState("");
  const [formIsDirty, setFormIsDirty] = useState(false);
  const invalidString = useMemo(() => validateUsername(userName), [userName]);

  return (
    <Dialog
      allowClose={false}
      open={true}
      contents={
        <>
          <h2 className="text-green-400 drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] m-4 text-center text-3xl">
            Welcome to Supaship!!
          </h2>
          <p className="text-center">
            Let's get started by creating a username:
          </p>
          <form
            className="grid grid-cols-1 place-items-center"
            onSubmit={(event) => {
              event.preventDefault();
              supaClient
                .from("user_profiles")
                .insert([
                  {
                    user_id: user.session?.user.id,
                    username: userName,
                  },
                ])
                .then(({ error }) => {
                  if (error) {
                    setServerError(`Username "${userName}" is already taken`);
                  } else {
                    const target = localStorage.getItem("returnPath") || "/";
                    localStorage.removeItem("returnPath");
                    navigate(target);
                  }
                });
            }}
          >
            <input
              name="username"
              placeholder="Username"
              onChange={({ target }) => {
                setUserName(target.value);
                if (!formIsDirty) {
                  setFormIsDirty(true);
                }
                if (serverError) {
                  setServerError("");
                }
              }}
              className="text-2xl font-display rounded border-2 text-color-green-400 border-green-400 p-2 m-4 text-center text-green-400 drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] m-4 text-center text-3xl"
            ></input>
            {formIsDirty && (invalidString || serverError) && (
              <p className="text-red-400 validation-feedback text-center">
                {serverError || invalidString}
              </p>
            )}
            <p className="text-center">
              This is the name people will see you as on the Message Board
            </p>
            <button
              className="font-display text-2xl bg-green-400 text-center rounded p-2 m-2 mb-8"
              type="submit"
              disabled={invalidString != null}
            >
              Submit
            </button>
          </form>
        </>
      }
    />
  );
}

/**
 * This only validates the form on the front end.
 * Server side validation is done at the sql level.
 */
function validateUsername(username: string): string | undefined {
  if (!username) {
    return "Username is required";
  }
  const regex = /^[a-zA-Z0-9_]+$/;
  if (username.length < 4) {
    return "Username must be at least 4 characters long";
  }
  if (username.length > 14) {
    return "Username must be less than 15 characters long";
  }
  if (!regex.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return undefined;
}
