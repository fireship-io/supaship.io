import { useContext } from "react";
import { redirect } from "react-router-dom";
import { UserContext } from "./App";

export function userWelcomeLoader() {
  const user = useContext(UserContext);
  if (user.session && !user.profile) {
    redirect("/welcome");
  }
}
