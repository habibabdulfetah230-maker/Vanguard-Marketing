import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";
import { ensureDefaultAdmin } from "./modules/auth/auth.service.js";

let server;

const startServer = async () => {
  try {
    const dbConnected = await connectDatabase();

    // Create default admin user if database is connected
    if (dbConnected && env.defaultAdmin.email && env.defaultAdmin.password) {
      try {
        await ensureDefaultAdmin({
          email: env.defaultAdmin.email,
          password: env.defaultAdmin.password,
          name: env.defaultAdmin.name,
        });
        console.log("[server] Default admin user ensured");
      } catch (error) {
        console.error("[server] Failed to create default admin:", error.message);
      }
    } else {
      console.log("[server] Skipping admin creation - database not connected or credentials missing");
    }

    server = http.createServer(app);

    server.listen(env.port, () => {
      console.log(`[server] Listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("[server] Failed to start server", error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = (signal) => {
  console.log(`[server] Received ${signal}. Shutting down...`);
  if (server) {
    server.close(() => {
      console.log("[server] Closed out remaining connections");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] Unhandled Promise rejection", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[server] Uncaught exception", error);
  gracefulShutdown("uncaughtException");
});
