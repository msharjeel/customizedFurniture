import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import ProductPage from "./views/ProductPage";
import AllProducts from "./views/AllProducts";
import BOQ from "./views/boq";
import AddMaterial from "./views/AddMaterial";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/boq",
        element: <BOQ />,
      },
      {
        path: "/products/create",
        element: <ProductPage />,
      },
      {
        path: "/products/edit/:id",
        element: <ProductPage />,
      },
      {
        path: "/addmaterial",
        element: <AddMaterial />,
      },
      {
        path: "/allproducts",
        element: <AllProducts />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
 
]);

export default router;
