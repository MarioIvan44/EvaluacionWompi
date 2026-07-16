import express from "express"
//IMPORT ROUTES

import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();
app.use(cors({origin: ["https://localhost:5173", "https://localhost:5174"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

//CREATE ENDPOINTS


export default app;