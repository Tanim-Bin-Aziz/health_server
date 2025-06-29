import express, { Application, Request, Response } from "express";
import cors from "cors";

import router from "./app/modules/routes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";

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

app.use("/api/v1", router);
app.use(globalErrorHandler);

export default app;
