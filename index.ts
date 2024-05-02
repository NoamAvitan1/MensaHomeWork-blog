import express, { Express } from "express";
import * as dotenv from "dotenv";
import http from "http";
dotenv.config();

//import middlewares
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

//routes
import userRoutes from "./routes/user";
import blogRoutes from "./routes/blog"

//creae an express app
const app: Express = express();

//midlewares
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the environment variables');
    process.exit(1); // Exit the process if MONGO_URI is not defined
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Create an HTTP server
    const server = http.createServer(app);
    // Start the server
    server.listen(process.env.PORT, () => {
      console.log(`server listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
