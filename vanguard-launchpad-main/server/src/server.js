import http from "http";
import app from "./app.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";
import { ensureDefaultAdmin } from "./modules/auth/auth.service.js";

let server;

const startServer = async () => {
  try {
    // Try to connect to database, but don't fail if it doesn't work
    try {
      await connectDatabase();
    } catch (dbError) {
      console.warn("[server] Database connection failed, continuing without database:", dbError.message);
    }

    // Try to create default admin, but don't fail if database is not connected
    if (env.defaultAdmin.email && env.defaultAdmin.password) {
      try {
        await ensureDefaultAdmin({
          email: env.defaultAdmin.email,
          password: env.defaultAdmin.password,
          name: env.defaultAdmin.name,
        });
      } catch (adminError) {
        console.warn("[server] Could not create default admin:", adminError.message);
      }
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
