import { Session } from "@supabase/supabase-js";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./App";
import { supaClient } from "./supa-client";
import { SupashipUserInfo } from "./use-session";

export function EmailListSignup() {
  const { session } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [emailListId, setEmailListId] = useState("");
  const [stopAsking, setStopAsking] = useState(false);
  const [justRemovedFromList, setJustRemovedFromList] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [bumper, setBumper] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("stopAskingEmailList")?.toLowerCase() === "true") {
      setStopAsking(true);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) {
      return;
    }
    checkForEmailListSignup(session.user).then((emailListData) => {
      if (!emailListData) {
        // setShowForm(true);
        setShowConfirmation(false);
        setConfirmedEmail("");
        return;
      }
      setEmailListId(emailListData.id);
      if (emailListData.approved) {
        setConfirmedEmail(emailListData?.email);
        setShowConfirmation(true);
        setShowForm(false);
      }
      if (emailListData.stop_asking) {
        setStopAsking(true);
      }
    });
  }, [bumper, session]);

  useEffect(() => {
    if (showForm && inputRef.current) {
      if (session?.user?.email) {
        setEmail(session.user.email);
        inputRef.current.value = session.user.email;
      }
      inputRef.current.focus();
    }
  }, [showForm]);

  if (stopAsking) {
    return <></>;
  }
  if (!session?.user) {
    return <></>;
  }

  return showConfirmation ? (
    <div
      data-e2e="email-confirmation-notice"
      className="email-list-signup rounded drop-shadow border-green-800 border-2 bg-gray-400 my-4 p-2 grid grid-cols-1 place-items-center gap-4"
    >
      <h2 className="text-center">
        You're signed up for an email when the course launches!
      </h2>

      <button
        data-e2e="email-remove-button"
        onClick={async () => {
          const { data, error } = await supaClient
            .from("email_list")
            .update({
              email: "fake@fake.fake",
              user_id: session?.user.id || null,
              approved: false,
              stop_asking: false,
              id: emailListId,
            })
            .select();
          if (data && !error) {
            setJustRemovedFromList(true);
            setShowConfirmation(false);
          }
        }}
        className="bg-red-400 rounded font-display text-lg p-2"
      >
        Take me off your list!
      </button>
    </div>
  ) : justRemovedFromList ? (
    <div
      data-e2e="email-remove-confirmation"
      className="rounded drop-shadow border-green-800 border-2 bg-gray-400 my-4 p-2 text-center"
    >
      <h2 className="text-center">
        You've got it, you've been removed from the email list.
      </h2>
    </div>
  ) : (
    <div className="email-list-signup rounded border-green-800 border-2 bg-gray-400 my-4 p-2 drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] text-center">
      <h2 className="text-center">
        Want to get an email when our course goes live?
      </h2>
      {showForm ? (
        <>
          <form
            className="grid place-items-center"
            data-e2e="email-signup-form"
            onSubmit={async (event) => {
              event.preventDefault();
              const { data } = emailListId
                ? await supaClient
                    .from("email_list")
                    .update({
                      user_id: session?.user.id,
                      email,
                      approved: true,
                      id: emailListId,
                    })
                    .select("*")
                    .single()
                : await supaClient
                    .from("email_list")
                    .insert({
                      user_id: session?.user.id,
                      email,
                      approved: true,
                    })
                    .select("*")
                    .single();
              if (data) {
                setEmailListId(data.id);
                setShowConfirmation(true);
                setConfirmedEmail(data.email);
              } else {
                setErrorMessage(
                  "Hrmm... something went wrong there. Maybe check the input and try again?"
                );
              }
            }}
          >
            <input
              ref={inputRef}
              type="email"
              data-e2e="email-signup-input"
              className="text-2xl font-display rounded border-2 text-color-green-400 border-green-400 p-2 m-4 text-center text-green-400 drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] m-4 text-center text-3xl"
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />
            <div>
              <button
                type="submit"
                disabled={!isEmailValid(email)}
                className="bg-green-400 rounded font-display text-lg p-2 mx-4"
              >
                Sign Up For Emails
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                }}
                className="bg-gray-400 rounded font-display text-lg p-2"
              >
                Cancel
              </button>
            </div>
            {errorMessage && <p className="text-red-400">{errorMessage}</p>}
          </form>
        </>
      ) : (
        <>
          <div className="flex justify-center gap-6 mt-4">
            <button
              data-e2e="email-signup"
              onClick={() => setShowForm(true)}
              className="bg-green-400 rounded font-display text-lg p-2"
            >
              Sure
            </button>
            <button
              onClick={async () => {
                setStopAsking(true);
                if (session?.user) {
                  await supaClient
                    .from("email_list")
                    .insert({
                      user_id: session?.user.id,
                      email: session?.user.email,
                      approved: false,
                      stop_asking: true,
                    })
                    .select("*")
                    .single();
                } else {
                  localStorage.setItem("stopAskingEmailList", "true");
                }
              }}
              className="bg-red-400 rounded font-display text-lg p-2"
            >
              Stop Asking
            </button>
          </div>
        </>
      )}
    </div>
  );
}

async function checkForEmailListSignup(user: Session["user"]) {
  const { data, error } = await supaClient
    .from("email_list")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

function isEmailValid(email: string) {
  return /^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$/.test(email);
}
