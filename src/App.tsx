import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FilterPage, { loader } from "./FilterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FilterPage />,
    loader: loader
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}