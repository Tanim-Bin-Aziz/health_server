import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoute } from "./app/modules/User/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";

const app: Application = express();

app.use(cors());
//parser added
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "health care server..",
  });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", AdminRoutes);

export default app;
