import { useContext, useEffect, useRef, useState } from "react";
import { supaClient } from "./supa-client";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { UserContext } from "./App";
import Dialog from "./Dialog";

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<"sign_in" | "sign_up">("sign_in");
  const { session } = useContext(UserContext);

  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      setShowModal(false);
    }
  }, [session]);

  const setReturnPath = () => {
    localStorage.setItem("returnPath", window.location.pathname);
  };

  return (
    <>
      <div className="flex m-4 place-items-center">
        <button
          className="md:inline-block px-4 py-2 text-xl font-display text-black hover:text-white bg-white hover:bg-purple-600 drop-shadow-[6px_6px_0_black] hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all duration-300"
          onClick={() => {
            setAuthMode("sign_in");
            setShowModal(true);
            setReturnPath();
          }}
        >
          login
        </button>{" "}
        <span className="p-2"> or </span>{" "}
        <button
          className="md:inline-block px-4 py-2 text-xl font-display text-black hover:text-white bg-white hover:bg-purple-600 drop-shadow-[6px_6px_0_black] hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all duration-300"
          onClick={() => {
            setAuthMode("sign_up");
            setShowModal(true);
            setReturnPath();
          }}
        >
          sign up
        </button>
      </div>
      <Dialog
        open={showModal}
        dialogStateChange={(open) => setShowModal(open)}
        contents={
          <>
            <Auth
              providers={["google"]}
              supabaseClient={supaClient}
              appearance={{
                theme: ThemeSupa,
                className: {
                  container: "grid grid-cols-1 place-content-center",
                  label: "text-white text-xl font-display",
                  button: "text-black text-xl font-display",
                  input:
                    "text-2xl font-display font-normal rounded border-2 text-green-400 border-green-400 text-center drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] bg-white",
                },
              }}
              view={authMode}
            />
            <button onClick={() => setShowModal(false)}>Close</button>
          </>
        }
      />
    </>
  );
}
