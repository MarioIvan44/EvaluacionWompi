/**
 * fields
 * name
● email
● password
● isVerified
● loginAttempts
● timeOut
 */

import moongose, {Schema, model} from "mongoose"

const adminsSchema = new Schema ({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    isVerified: {
        type: Boolean
    },
    loginAttempts: {
        type: Number
    },
    timeOut: {
        type: Date
    }
}, {
    timestamps: true,
    strict: false
})

export default model("admins", adminsSchema)