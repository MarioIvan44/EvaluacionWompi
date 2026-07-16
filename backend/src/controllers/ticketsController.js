const ticketsController = {}

/**
 * fields
    customerId
    quantity
    purchaseDate
    total
    paymentStatus
    transactionId

 */ 
import ticketsModel from "../models/tickets.js"

//SELECT
ticketsController.get = async(req, res) => {
    try {
        const tickets = await ticketsModel.find().populate("customerId", " ").populate("transactionId", " ");
        return res.status(200).json(tickets)
    } catch (error) {
        console.error("error: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//CREATE
ticketsController.create = async(req, res) => {
    try {
        const {customerId, quantity, purchaseDate, total, paymentStatus, transactionId} = req.body;
        const newTicket = new ticketsModel({customerId, quantity, purchaseDate, total, paymentStatus, transactionId});
        await newTicket.save();

        return res.status(200).json({message: "Created"})
    } catch (error) {
        console.error("error: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//PUT
ticketsController.put = async(req, res) => {
    try {
        const {customerId, quantity, purchaseDate, total, paymentStatus, transactionId} = req.body;
        const updated = await ticketsModel.findByIdAndUpdate(req.params.id,{customerId, quantity, purchaseDate, total, paymentStatus, transactionId}, {new: true} )

        if(!updated){
            return res.status(404).json({message: "Not found"})
        }

        return res.status(200).json({message: "Updated"})
    } catch (error) {
        console.error("error: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

//DELETE
ticketsController.delete = async(req, res) => {
    try {
        const deleted = await ticketsModel.findByIdAndDelete(req.params.id)

        if(!deleted){
            return res.status(404).json({message: "Not found"})
        }


        return res.status(200).json({message: "Deleted"})
    } catch (error) {
        console.error("error: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export default ticketsController;
