import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcryptjs"
import customerModel from "../models/customers.js"
import { config } from "../../config.js"

const loginCustomerController = {}

loginCustomerController.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userfound = await customerModel.findOne({email});

        if(!userfound){
            return res.status(400).json({message: "Customer not found"})
        }

        if(userfound.timeOut && userfound.timeOut > Date.now()){
            return res.status(403).json({message: "cuenta bloqueada"})
        }

        const isMatch = await bcrypt.compare(password, userfound.password)

        if(!isMatch){
            userfound.loginAttempts = (userfound.loginAttempts || 0) +1;
            if(userfound.loginAttempts >= 3){
                userfound.timeOut = Date.now() + 15 + 60+1000;
                userfound.loginAttempts = 0; 

                await userfound.save();
                return res.status(403).json({message: "Cuenta bloqueado"})
            }
            await userfound.save();
            return res.status(401).json({message: "Contraseña incorrecta"})
        }

        userfound.loginAttempts = 0;
        userfound.timeOut = null;
        await userfound.save()

        const token = jsonwebtoken.sign(
            {id: userfound._id, userType: "customer"},
            config.JWT.secret,
            {expiresIn: "7d"}
        )

        res.cookie("authCookie", token)

        return res.status(200).json({message: "Login succesful", token})
    } catch (error) {
        console.log("error: " + error)
        return res.status(500).json({message: "Error al iniciar sesión"})
    }
}

export default loginCustomerController;