import { useEffect, useState } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import Dislikes from "../pages/Dislikes/Dislikes";
import Languages from "../pages/Languages/Languages";
import Likes from "../pages/Likes/Likes";
import Login from "../pages/Login/Login";
import Main from "../pages/Main/Main";
import { persistentStorage } from "../services";

const authRoutes: RouteObject[] = [
  { path: "/dev/languages", element: <Languages /> },
  { path: "/dev/search", element: <Main /> },
  { path: "/dev/likes", element: <Likes /> },
  { path: "/dev/dislikes", element: <Dislikes /> },
]

const globalRoutes: RouteObject[] = [
  { path: "/", element: <Login /> },
]

export default function Routes() {

  const [_routes, setRoutes] = useState<RouteObject[]>([])


  useEffect(() => {
    const middleware = () => {
      const _id = persistentStorage.getItem('id')
      console.log(_id)
      setRoutes([...globalRoutes, ...(_id ? authRoutes : []), {
        path: '*', element: <Navigate to="/" replace />
      }])
    }
    persistentStorage.subscribe(middleware)
    middleware()
  }, [])

  const routes = useRoutes(_routes)

  return routes
}