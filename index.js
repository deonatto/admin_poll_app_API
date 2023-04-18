import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import pollRoutes from "./routes/poll.js";
import pollOptionsRoutes from "./routes/pollOptions.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/poll", pollRoutes);
app.use("/pollOptions", pollOptionsRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
//ensure that only the fields that are specified in your Schema will be saved in the database
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
