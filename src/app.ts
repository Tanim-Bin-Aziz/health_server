import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
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

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "page Not Founded 404",
    },
  });
});

export default app;
