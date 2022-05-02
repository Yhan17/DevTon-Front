import { useRoutes } from "react-router-dom";
import Languages from "../pages/Languages/Languages";
import Login from "../pages/Login/Login";
import Main from "../pages/Main";

export default function Routes() {
  const routes = useRoutes([
    { path: "/", element: Login() },
    { path: "/dev/languages", element: Languages() },
    { path: "/dev/search", element: Main() },
  ])

  return routes
}