const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, "Image must be filled!"]
    }
})

module.exports = mongoose.model("Image", imageSchema);