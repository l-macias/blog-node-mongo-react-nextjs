import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import blogRoutes from "./routes/blog.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import formRoutes from "./routes/form.js";
import categoryRoutes from "./routes/category.js";
import tagRoutes from "./routes/tag.js";
dotenv.config();

const app = express().use("*", cors());

//Middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.json());
//Routes Middlewares
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formRoutes);
app.use(cors());
//cors
if (process.env.NODE_ENV === "development") {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//db
mongoose
    .connect(process.env.DATABASE_CLOUD, {})
    .then(() => console.log("MONGO DB Connected"));
