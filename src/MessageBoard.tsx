import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { AllPosts } from "./AllPosts";
import { UserContext } from "./App";
import { CreatePost } from "./CreatePost";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function MessageBoard() {
  const userProfile = useContext(UserContext);
  return (
    <>
      <h2 className="text-5xl text-center mb-1">Message Board</h2>
      {userProfile.session ? (
        <>
          <CreatePost />
          <AllPosts />
        </>
      ) : (
        <h2>
          Yo Bro. you gotta <Login /> to join in the discussion.
        </h2>
      )}
      <Outlet />
    </>
  );
}
