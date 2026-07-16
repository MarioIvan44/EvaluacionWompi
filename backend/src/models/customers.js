/**
 * fields
 * name
● email
● password
● isVerified
● loginAttempts
● timeOut
 */

import moongose, {schema, model} from "moongose"

const customersSchema = new Schema ({
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

export default model("customers", customersSchema)