import { createContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { supaClient } from "./supa-client";
import { SupashipUserInfo, useSession } from "./use-session";
import Login from "./Login";
import UserMenu from "./UserMenu";
import NavBar from "./NavBar";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import MessageBoard from "./MessageBoard";
import { UserContextProvider } from "@supabase/auth-ui-react/dist/esm/src/components/Auth/UserContext";
import { AllPosts, allPostsLoader } from "./AllPosts";
import { Welcome, welcomeLoader } from "./Welcome";
import { postDetailLoader, PostView } from "./Post";
import Home from "./Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "message-board",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts />,
            loader: allPostsLoader as any,
          },
          {
            path: "post/:postId",
            element: <PostView />,
            loader: postDetailLoader as any,
          },
        ],
      },
      {
        path: "welcome",
        element: <Welcome />,
        loader: welcomeLoader,
      },
    ],
  },
]);

export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
});

function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
  const { session, profile } = useSession();
  return (
    <UserContext.Provider value={{ session, profile }}>
      <NavBar />
      <Outlet />
    </UserContext.Provider>
  );
}

export default App;
