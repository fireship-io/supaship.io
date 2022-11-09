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
      {userProfile.session ? (
        <></>
      ) : (
        <h2 className="text-center m-6">
          Yo Dawg. you gotta <Login /> to join in the discussion.
        </h2>
      )}
      <Outlet />
    </div>
  );
}
