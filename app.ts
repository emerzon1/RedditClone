import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import usersRouter from "./routes/users";
import subredditRouter from "./routes/subreddit";
import postRouter from "./routes/post";
import authRouter, { authenticateToken } from "./routes/auth";

dotenv.config();

// process.on("SIGINT", () => {
// 	console.log("Interrupted/ended.");
// 	db.close();
// });

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/subreddits", authenticateToken, subredditRouter);
app.use("/api/posts", authenticateToken, postRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

export default app;
