const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name must be filled!"]
    }
})

module.exports = mongoose.model("Category", categorySchema);