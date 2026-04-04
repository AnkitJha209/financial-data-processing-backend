import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { exportRoutes } from "./routes/export.routes";
import { chatRoutes } from "./routes/chat.routes";
import { recordRoutes } from "./routes/record.routes";
import { adminRoutes } from "./routes/admin.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
