import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./App";
import Dialog from "./Dialog";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const { session } = useContext(UserContext);
  const [showProDialog, setShowProDialog] = useState(false);
  return (
    <>
      <nav className="flex justify-between align-center max-w-screen-2xl mx-auto px-3 md:px-8 p-6 md:p-8 text-gray1 w-full">
        <Link className="flex justify-center items-center text-center" to="/">
          <img
            id="logo"
            className="hover:scale-125 transition hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] w-64 mt-4"
            src="supaship_logo_with_text.svg"
            alt="logo"
          />
        </Link>

        <ul className="flex justify-center items-center">
          <li
            slot="basic"
            className="mx-2 md:mx-4 hover:scale-105 transition-transform"
          >
            <button
              className="font-display text-base font-normal text-green-500 border-green-400 border rounded-md px-2 py-1 hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] flex"
              onClick={() => setShowProDialog(true)}
            >
              <img className="h-6 mr-2" src="supaship_logo.svg" />
              <span className="inline-block">
                get the course to build this site on fireship pro
              </span>
              <img className="h-6 ml-2" src="supaship_logo.svg" />
            </button>
          </li>
          {/* <li className="mx-2 md:mx-4 hover:scale-105 transition-transform">
          <a
            href="/lessons"
            className="font-sans text-xl font-bold leading-none text-gray2 hover:text-white"
          >
            videos
          </a>
        </li> */}
          <li className="mx-2 md:mx-4 hover:scale-105 transition-transform">
            <Link
              to="message-board/1"
              className="font-sans text-xl font-bold leading-none text-gray2 gradient-slide"
            >
              message board
            </Link>
          </li>
          {/* search bar <li className="ml-2">
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
        </li> */}
          <li className="ml-2 mr-6 relative">
            {session?.user ? <UserMenu /> : <Login />}
          </li>
        </ul>
      </nav>
      <Dialog
        open={showProDialog}
        dialogStateChange={(open) => {
          setShowProDialog(open);
        }}
        contents={
          <>
            <div className="flex flex-col content-center gap-6">
              <h2 className="text-green-400 drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] m-4 text-center text-3xl">
                We're not quite ready yet
              </h2>
              <p className="text-center">
                Expect the course to drop sometime around Thanksgiving 2022. In
                the meantime - you can checkout the{" "}
                <a
                  href="https://fireship.io/courses"
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] transition duration-500"
                >
                  sweet, sweet courses
                </a>{" "}
                currently available at Fireship Pro:
              </p>
              <a
                href="https://fireship.io/courses"
                target="_blank"
                rel="noreferrer"
                className="grid place-content-center"
              >
                <img
                  src="https://fireship.io/img/logo.svg"
                  className="h-24 hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] transition duration-500"
                />
              </a>
              <p className="text-center">
                Be sure to checkout our YouTube channels as well for more coding
                vids:
              </p>
              <div className="grid grid-cols-2 gap-4 place-content-around w-full h-96 my-6 ">
                <YoutubeChannelLink
                  channelUrl="https://www.youtube.com/c/Fireship"
                  channelName="Fireship"
                  iconImgUrl="https://yt3.ggpht.com/ytc/AMLnZu80d66aj0mK3KEyMfpdGFyrVWdV5tfezE17IwRkhw=s88-c-k-c0x00ffffff-no-rj"
                />
                <YoutubeChannelLink
                  channelUrl="https://www.youtube.com/channel/UC2Xd-TjJByJyK2w1zNwY0zQ"
                  channelName="Beyond Fireship"
                  iconImgUrl="https://yt3.ggpht.com/3MC9XX7rtxeS55uoOQG2nvJ7zaBd17r8Uh0yk_R3KyKjAK_u4RlHhZcTCkx4yym0guGWdefD5Q=s88-c-k-c0x00ffffff-no-rj"
                />
                <YoutubeChannelLink
                  channelUrl="https://www.youtube.com/c/JeffDelaney23"
                  channelName="Jeff Delaney"
                  iconImgUrl="https://yt3.ggpht.com/ytc/AMLnZu8ANpB368h3Yza9WYqk47OCN0Pmb-VVL_VywtBINew=s88-c-k-c0x00ffffff-no-rj"
                />
                <YoutubeChannelLink
                  channelUrl="https://www.youtube.com/@Supaship6000"
                  channelName="Supaship"
                  iconImgUrl="https://yt3.ggpht.com/eYTXAMARvxilOVizLCR9DLsR3IiFRXR6KvEOdVzLt8dU04ArhZ0EZpV-RZtWoPJXjQdMjUV67Q=s88-c-k-c0x00ffffff-no-rj"
                />
              </div>
            </div>
            <button className="mt-8" onClick={() => setShowProDialog(false)}>
              Close
            </button>
          </>
        }
      />
    </>
  );
}

function YoutubeChannelLink({
  channelUrl,
  channelName,
  iconImgUrl,
}: {
  channelUrl: string;
  channelName: string;
  iconImgUrl: string;
}) {
  return (
    <a
      href={channelUrl}
      target="_blank"
      rel="noreferrer"
      className="hover:drop-shadow-[0_0_9px_rgba(34,197,94,0.9)] transition duration-500 grid grid-col-1 place-content-center gap-2 h-32"
    >
      <div className="grid place-content-center">
        <img
          src={iconImgUrl}
          className="rounded-full h-24 w-24 object-cover text-center"
        />
      </div>
      <h3 className="text-center w-32">{channelName}</h3>
    </a>
  );
}
