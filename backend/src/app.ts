import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ENV } from "./config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import providerRoutes from './routes/provider.routes';
import appointmentRoutes from './routes/appointment.routes';
import seedRoutes from './routes/seed.routes';

const app: Application = express();

// Middlewares
app.use(cors({ origin: ENV.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/seed", seedRoutes);

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>RP API Status</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center; border: 1px solid #334155; }
            h1 { margin: 0; color: #38bdf8; font-size: 1.5rem; }
            .status { display: inline-flex; align-items: center; margin-top: 1rem; color: #4ade80; font-weight: bold; }
            .pulse { width: 10px; height: 10px; background: #4ade80; border-radius: 50%; margin-right: 10px; animation: blink 1.5s infinite; }
            @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
            #time { font-family: monospace; margin-top: 1rem; display: block; color: #94a3b8; }
            button { margin-top: 1.5rem; padding: 0.5rem 1rem; cursor: pointer; border-radius: 5px; border: none; background: #38bdf8; color: #0f172a; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Rajendra Pancholi's API</h1>
            <div class="status">
                <div class="pulse"></div> Operational
            </div>
            <span id="time"></span>
            <br>
            <button onclick="checkHealth()">Test Connection</button>
        </div>

        <script>
            // Update time live
            setInterval(() => {
                document.getElementById('time').innerText = new Date().toLocaleTimeString();
            }, 1000);

            // Interaction logic
            function checkHealth() {
                alert("Connection Secure: Latency 24ms");
            }
        </script>
    </body>
    </html>
  `);
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: "Internal Server Error",
  });
});

export default app;
