import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./App";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { session } = useContext(UserContext);
  return (
    <nav className="flex justify-between max-w-screen-2xl mx-auto px-3 md:px-8 p-6 md:p-8 text-gray1">
      <a
        className="flex justify-center items-center text-center w-12 h-12 logo-gif"
        href="/"
      >
        <img
          id="logo"
          className="hover:scale-125 transition hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)]"
          src="supaship_logo.png"
          alt="logo"
        />
      </a>

      <ul className="flex justify-center items-center">
        <li
          slot="basic"
          className="mx-2 md:mx-4 hover:scale-105 transition-transform"
        >
          <a
            href="/pro"
            className="font-display text-base font-normal text-green-500 border-green-400 border rounded-md px-2 py-1 hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)]"
          >
            <span className="inline-block">
              get the course to build this site on fireship pro
            </span>
          </a>
        </li>
        <li className="mx-2 md:mx-4 hover:scale-105 transition-transform">
          <a
            href="/lessons"
            className="font-sans text-xl font-bold leading-none text-gray2 hover:text-white"
          >
            videos
          </a>
        </li>
        <li className="mx-2 md:mx-4 hover:scale-105 transition-transform">
          <Link
            to="message-board/1"
            className="font-sans text-xl font-bold leading-none text-gray2 gradient-slide"
          >
            message board
          </Link>
        </li>
        <li className="ml-2">
          <button className="p-2 mr-2 hidden md:flex justify-between items-center bg-white bg-opacity-10 hover:bg-opacity-20 border border-gray4 hover:border-purple-500 shadow-xl hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all">
            <span className="text-gray2 w-4 mx-2">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fad"
                data-icon="search"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="svg-inline--fa fk-search fk-w-16 fk-9x"
              >
                <g className="fk-group">
                  <path
                    fill="currentColor"
                    d="M208 80a128 128 0 1 1-90.51 37.49A127.15 127.15 0 0 1 208 80m0-80C93.12 0 0 93.12 0 208s93.12 208 208 208 208-93.12 208-208S322.88 0 208 0z"
                    className="fk-secondary"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M504.9 476.7L476.6 505a23.9 23.9 0 0 1-33.9 0L343 405.3a24 24 0 0 1-7-17V372l36-36h16.3a24 24 0 0 1 17 7l99.7 99.7a24.11 24.11 0 0 1-.1 34z"
                    className="fk-primary"
                  ></path>
                </g>
              </svg>
            </span>
            <span className="mr-12">Search</span>
            <span className="mx-2 text-xs border border-gray4 rounded-md p-1 px-2">
              /
            </span>
          </button>
          <button className="flex md:hidden">
            <span className="text-gray2 w-6 mx-2">
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fad"
                data-icon="search"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="svg-inline--fa fk-search fk-w-16 fk-9x"
              >
                <g className="fk-group">
                  <path
                    fill="currentColor"
                    d="M208 80a128 128 0 1 1-90.51 37.49A127.15 127.15 0 0 1 208 80m0-80C93.12 0 0 93.12 0 208s93.12 208 208 208 208-93.12 208-208S322.88 0 208 0z"
                    className="fk-secondary"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M504.9 476.7L476.6 505a23.9 23.9 0 0 1-33.9 0L343 405.3a24 24 0 0 1-7-17V372l36-36h16.3a24 24 0 0 1 17 7l99.7 99.7a24.11 24.11 0 0 1-.1 34z"
                    className="fk-primary"
                  ></path>
                </g>
              </svg>
            </span>
          </button>
        </li>
        <li className="ml-2 mr-6 relative">
          {session?.user ? <UserMenu /> : <Login />}
        </li>
      </ul>
    </nav>
  );
}
