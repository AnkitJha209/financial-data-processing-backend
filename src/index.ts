import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
