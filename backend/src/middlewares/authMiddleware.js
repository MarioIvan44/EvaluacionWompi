import jwt from "jsonwebtoken"
import { config } from "../../config.js"

export const validateAuthCookie = (AllowedTypes = ["admin", "customer"]) => {
    return (req, res, next) => {
        try{
            const {authCookie} = req.cookies;

            if(!authCookie){
                return res.status(404).json({message: "No cookie found, authorization required"})
            }

            const decoded = jwt.verify(authCookie, config.JWT.secret)

            if(!AllowedTypes.includes(decoded.userType)){
                return res.status(401).json({message: "Access denied"})
            }

            next()
        } catch(error) {
            console.error("error: " + error)
            return res.status(500).json({message: "Internal server error"})
        }
    }
}