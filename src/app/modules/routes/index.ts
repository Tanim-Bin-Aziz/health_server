import express from "express";
import { userRoute } from "../User/user.routes";
import { AdminRoutes } from "../Admin/admin.routes";
import { AuthRoutes } from "../Auth/auth.routes";

const router = express.Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
