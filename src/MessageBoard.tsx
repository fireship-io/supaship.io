import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { AllPosts } from "./AllPosts";
import { UserContext } from "./App";
import { CreatePost } from "./CreatePost";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function MessageBoard() {
  const userProfile = useContext(UserContext);
  return (
    <div className="flex flex-col place-content-center w-full">
      <Link to="/message-board/1">
        <h2 className="text-5xl text-center mb-1">Message Board</h2>
      </Link>
      <div className="grid place-content-center">
        <div className="text-center font-sans drop-shadow border-gray-800 border-2 rounded-lg bg-gray-600 w-96 m-8 p-4">
          <p>WARNING: Message board is still in early development.</p>
          <ul className="text-left marker:text-green-400 list-disc pl-4">
            <li>There is no guarantee that your posts will persist.</li>
            <li>Please stay on topic.</li>
            <li>Inappropriate posts will be removed.</li>
          </ul>
        </div>
      </div>
      {userProfile.session ? (
        <></>
      ) : (
        <h2
          className="text-center m-6 flex justify-center place-items-center"
          data-e2e="message-board-login"
        >
          Yo Dawg. you gotta <Login /> to join in the discussion.
        </h2>
      )}
      <Outlet />
    </div>
  );
}
