import express from "express"
//IMPORT ROUTES
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import loginCustomerRoutes from "./src/routes/loginCustomer.js"
import logoutRoutes from "./src/routes/logout.js"
import registerAdmin from "./src/routes/registerAdmins.js"
import registerCustomers from "./src/routes/registerCustomers.js"
import ticketsRoutes from "./src/routes/tickets.js"
import wompiRoutes from "./src/routes/wompiRoutes.js"

import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();
app.use(cors({origin: ["https://localhost:5173", "https://localhost:5174"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

//CREATE ENDPOINTS
app.use("/api/loginAdmin", loginAdminRoutes)
app.use("/api/loginCustomer", loginCustomerRoutes)
app.use("/api/logout", logoutRoutes)
app.use("/api/registerAdmin", registerAdmin)
app.use("/api/registerCustomer", registerCustomers)
app.use("/api/tickets", ticketsRoutes)
app.use("/api/wompi", wompiRoutes)

export default app;