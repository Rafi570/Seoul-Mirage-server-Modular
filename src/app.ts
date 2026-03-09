import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./app/routes";

const app: Application = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://seoulc.vercel.app",
  "https://seoul-mirage-react-client.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Seoul Mirage API is up and running! 🚀");
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: err,
  });
});
export default app;
