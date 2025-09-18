import { lazy, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import ProtectRouter from "./ProtectRouter";
import { useAppDispatch } from "../store/hook";
import { setLocationUrl } from "../store/slice/auth.slice";

const NotFound = lazy(() => import("../pages/notFound"));
const Login = lazy(() => import("../pages/auth/login"));
const ManagerDashboard = lazy(() => import("../pages/employee/dashboard"))

const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/manager",
    element: <ProtectRouter />,
    children: [
      {
        path: "dashboard",
        element: <ManagerDashboard />,
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

interface IRouteProp {
  isAuth: boolean;
}

const Router = ({ isAuth }: Readonly<IRouteProp>) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (!isAuth && !location.pathname.includes('/login')) {
        dispatch(setLocationUrl(location.pathname))
        navigate('/login');
      }
    }, 1000);

    return () => clearTimeout(redirectTimeout);
  }, [dispatch, isAuth, location.pathname, navigate]);
  return (
    <>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </>
  );
};

const renderRoutes = (routes: RouteObject[]) => {
  return routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

export default Router;
