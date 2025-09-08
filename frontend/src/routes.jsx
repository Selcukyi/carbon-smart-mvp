import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./components/Login.jsx";
import Upload from "./pages/Upload.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Entities from "./pages/Entities.jsx";
import Allowances from "./pages/Allowances.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { 
    path: "/dashboard", 
    element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
  },
  { 
    path: "/upload", 
    element: <ProtectedRoute><Upload /></ProtectedRoute> 
  },
  { 
    path: "/entities", 
    element: <ProtectedRoute><Entities /></ProtectedRoute> 
  },
  { 
    path: "/allowances", 
    element: <ProtectedRoute><Allowances /></ProtectedRoute> 
  },
]);

