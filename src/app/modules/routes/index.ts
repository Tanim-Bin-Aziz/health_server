import express from "express";
import { userRoute } from "../User/user.routes";
import { AdminRoutes } from "../Admin/admin.routes";
import { AuthRoutes } from "../Auth/auth.routes";
import { SpecialtiesRoutes } from "../Specialties/specialties.routes";
import { DoctorRoutes } from "../Doctor/doctor.routes";
import { PatientRoutes } from "../Patient/patient.route";
import { ScheduleRoutes } from "../Schedule/schedule.routes";
import { DoctorScheduleRoutes } from "../DoctorSchedule/doctorSchedule.routes";

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
  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: DoctorScheduleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
