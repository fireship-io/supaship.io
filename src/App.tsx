import { createContext } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AllPosts } from "./AllPosts";
import "./App.css";
import Home from "./Home";
import MessageBoard from "./MessageBoard";
import NavBar from "./NavBar";
import { PostView } from "./Post";
import PrivacyPolicy from "./PrivacyPolicy";
import { SupashipUserInfo, useSession } from "./use-session";
import { Welcome, welcomeLoader } from "./Welcome";

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
          },
          {
            path: "post/:postId",
            element: <PostView />,
          },
        ],
      },
      {
        path: "welcome",
        element: <Welcome />,
        loader: welcomeLoader,
      },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
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
