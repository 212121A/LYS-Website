import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import stripeRouter from "./routes/stripe";
import { logger } from "./lib/logger";

const app: Express = express();
const webhookRouter = express.Router();

webhookRouter.use((req, _res, next) => {
  req.url = "/webhook";
  next();
});
webhookRouter.use(stripeRouter);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({
  origin: ["https://lysnoodleandrice.com", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/stripe/webhook")) {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use("/api/stripe/webhook", 
  express.raw({ type: "application/json" }),
  webhookRouter
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
