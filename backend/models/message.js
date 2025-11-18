const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to your 'User' model
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to your 'User' model
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    // timestamp: true (default: current timestamp)
    timestamps: true 
});

module.exports = mongoose.model('Message', messageSchema);