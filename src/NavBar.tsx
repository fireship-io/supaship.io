import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./App";
import Dialog from "./Dialog";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { session } = useContext(UserContext);
  return (
    <>
      <nav className="flex justify-between align-center max-w-screen-2xl mx-auto px-3 md:px-8 p-6 md:p-8 text-gray1 w-full">
        <Link
          className="flex justify-center items-center text-center invisible md:visible"
          to="/"
        >
          <img
            id="logo"
            className="hover:scale-125 transition hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] w-0 md:w-64 mt-4"
            src="https://supaship.io/supaship_logo_with_text.svg"
            alt="logo"
          />
        </Link>

        <ul className="flex justify-center items-center">
          <li
            slot="basic"
            className="mx-2 lg:mx-4 hover:scale-105 transition-transform invisible lg:visible w-0 lg:w-fit h-0 lg:h-fit"
          ></li>
          <li className="mx-2 md:mx-4 hover:scale-105 transition-transform">
            <Link
              to="message-board/1"
              className="font-sans text-xl font-bold leading-none text-gray2 gradient-slide"
            >
              message board
            </Link>
          </li>
          <li className="ml-2 mr-6 relative">
            {session?.user ? <UserMenu /> : <Login />}
          </li>
        </ul>
      </nav>
    </>
  );
}
