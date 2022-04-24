import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@aatix/common";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
