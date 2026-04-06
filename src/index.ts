import dotenv from "dotenv";
import express, { urlencoded } from "express";
import { authRoutes } from "./routes/auth.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { exportRoutes } from "./routes/export.routes";
import { chatRoutes } from "./routes/chat.routes";
import { recordRoutes } from "./routes/record.routes";
import { adminRoutes } from "./routes/admin.routes";
import { setupSwaggerDocs } from "./docs/swagger";
import rateLimit from "express-rate-limit";
import cors from "cors"

dotenv.config();

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(limiter);
app.use(cors())

app.get("/", (_req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/admin", adminRoutes);

setupSwaggerDocs(app);

app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
