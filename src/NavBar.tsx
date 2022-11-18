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
      <nav className="nav-bar">
        <Link className="nav-logo-link" to="/">
          <img
            id="logo"
            className="nav-logo"
            src="https://supaship.io/supaship_logo_with_text.svg"
            alt="logo"
          />
        </Link>

        <ul className="nav-right-list">
          <li className="nav-message-board-list-item">
            <Link to="/1" className="nav-message-board-link">
              message board
            </Link>
          </li>
          <li className="nav-auth-item">
            {session?.user ? <UserMenu /> : <Login />}
          </li>
        </ul>
      </nav>
    </>
  );
}
