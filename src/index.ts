import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005



app.use(cors());
app.use(express.json());

app.listen(3005,()=>{
    console.log("server is running on port 3000");
});