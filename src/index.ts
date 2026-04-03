import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { exportRoutes } from "./routes/export.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Mount auth routes with validation
app.use("/api/auth", authRoutes);

// Mount dashboard routes
app.use("/api/dashboard", dashboardRoutes);

// Mount export routes
app.use("/api/export", exportRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
