import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { UserRouter } from "./routes/user.route";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005



app.use(cors());
app.use(express.json());
app.use("/api/v1",UserRouter);

app.listen(PORT,()=>{
    console.log("server is running on port 3000");
});