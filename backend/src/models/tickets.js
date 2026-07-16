/**
 * fields
    customerId
    quantity
    purchaseDate
    total
    paymentStatus
    transactionId

 */

import moongose, {Schema, model} from "mongoose"

const ticketsSchema = new Schema ({
    customerId: {
        type: moongose.Schema.Types.ObjectId, 
        ref: "customers"
    },
    quantity: {
        type: Number
    },
    purchaseDate: {
        type: Date
    },
    total: {
        type: Number
    },
    paymentStatus: {
        type: String
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true,
    strict: false
})

export default model("tickets", ticketsSchema)