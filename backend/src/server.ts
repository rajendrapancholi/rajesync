import { createServer, type Server as HTTPServer } from "http";
import app from "./app";
import {ENV} from './config/env'
import { connectDB } from "./config/db";
import mongoose from "mongoose";

const PORT = Number(ENV.PORT) || 5000;
const HOST = ENV.HOST;
const NODE_ENV = process.env.NODE_ENV || "development";


const httpServer: HTTPServer = createServer(app);

(async () => {
  try {
    await connectDB();
    console.log("DB is connected via Mongoose!");

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server is running at "http://${HOST}:${PORT}" in ${NODE_ENV} mode`,
      );
    });

    httpServer.on("error", (error) => {
      console.error("HTTP Server Error:", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
})();

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);

  const forceExit = setTimeout(() => {
    console.error("Forcefully shutting down after timeout");
    process.exit(1);
  }, 10000);

  try {
    httpServer.close(() => {
      console.log("HTTP server closed.");
    });

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");

    clearTimeout(forceExit);
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

["SIGINT", "SIGTERM"].forEach((sig) => {
  process.on(sig, () => shutdown(sig));
});
