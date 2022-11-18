import { useContext } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { UserContext } from "./App";
import Login from "./Login";

export default function MessageBoard() {
  const userProfile = useContext(UserContext);
  const { pageNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  if (!pageNumber && !location.pathname.includes("post")) {
    navigate("/1");
  }

  return (
    <div className="message-board-container">
      <Link to="/1">
        <h2 className="message-board-header-link">Message Board</h2>
      </Link>
      {userProfile.session ? (
        <></>
      ) : (
        <h2
          className="message-board-login-message"
          data-e2e="message-board-login"
        >
          Yo Dawg. you gotta <Login /> to join in the discussion.
        </h2>
      )}
      <Outlet />
    </div>
  );
}
