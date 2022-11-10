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
    <div data-e2e="email-confirmation-notice">
      <h2>You're signed up for an email when the course launches!</h2>

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
      >
        Take me off your list!
      </button>
    </div>
  ) : justRemovedFromList ? (
    <div data-e2e="email-remove-confirmation">
      <h2>You've got it, you've been removed from the email list.</h2>
    </div>
  ) : (
    <div className="email-list-signup">
      <h2>Want to get an email when our course goes live?</h2>
      {showForm ? (
        <>
          <form
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
              onChange={({ target }) => {
                setEmail(target.value);
              }}
            />
            <button type="submit" disabled={!isEmailValid(email)}>
              Sign Up For Emails
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
              }}
            >
              Cancel
            </button>
            {errorMessage && <p className="text-red-400">{errorMessage}</p>}
          </form>
        </>
      ) : (
        <>
          <button data-e2e="email-signup" onClick={() => setShowForm(true)}>
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
          >
            Stop Asking
          </button>
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
