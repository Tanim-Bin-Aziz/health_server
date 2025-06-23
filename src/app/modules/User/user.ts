import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "route is working perfectly",
  });
});

export const userRoute = router;
