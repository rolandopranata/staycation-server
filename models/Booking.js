const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    bookingStartDate: {
        type: Date,
        required: true,
    },
    bookingEndDate: {
        type: Date,
        required: true,
    },
    invoice: {
        type: String,
        required: true,
    },
    itemId: {
        _id: {
            type: Object,
            ref: "Item",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
    },
    total: {
        type: Number,
        required: true,
    },
    memberId: {
        type: Object,
        ref: "Member",
    },
    bankId: {
        type: Object,
        ref: "Bank",
    },
    payments: {
        proofPayment: {
            type: String,
            required: true,
        },
        bankFrom: {
            type: String,
            required: true,
        },
        accountHolder: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Proses',
        },
    },
});

module.exports = mongoose.model("Booking", bookingSchema);