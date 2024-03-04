import { createHashRouter } from "react-router-dom";
import Home from "../pages/index";
import LoginOrRegister from "../pages/loginOrRegister";
import Editor from "../pages/editor";

export const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/login_or_register",
        element: <LoginOrRegister />,
      },
      {
        path: "/editor",
        element: <Editor />,
      },
    ],
  },
]);
