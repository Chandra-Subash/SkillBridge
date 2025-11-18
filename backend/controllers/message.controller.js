const Message = require('../models/message.js');
const User = require('../models/user.js');
const mongoose = require('mongoose');

// Get all conversations (unique users) for the logged-in user
module.exports.getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all messages sent or received by the current user
        const messages = await Message.find({
            $or: [{ sender_id: loggedInUserId }, { receiver_id: loggedInUserId }]
        }).sort({ createdAt: -1 }); // Get most recent messages first

        // Get a unique list of user IDs
        const userIds = new Set();
        messages.forEach(msg => {
            // Add the ID of the *other* person in the chat
            if (msg.sender_id.toString() !== loggedInUserId.toString()) {
                userIds.add(msg.sender_id.toString());
            }
            if (msg.receiver_id.toString() !== loggedInUserId.toString()) {
                userIds.add(msg.receiver_id.toString());
            }
        });

        // Fetch user details for these unique IDs
        const conversations = await User.find({
            _id: { $in: Array.from(userIds) }
        }).select('name role avatarUrl'); // Send back only needed info

        res.status(200).json({ conversations });

    } catch (error) {
        console.error("Get Conversations Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get message history between two users
module.exports.getMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const otherUserId = req.params.otherUserId;

        // Find all messages between these two users
        const messages = await Message.find({
            $or: [
                { sender_id: loggedInUserId, receiver_id: otherUserId },
                { sender_id: otherUserId, receiver_id: loggedInUserId }
            ]
        })
        .populate('sender_id','name avatarUrl role')
        .sort({ createdAt: 'asc' }) // Show oldest first
        .limit(100); // Limit to last 100 messages

        res.status(200).json({ messages });

    } catch (error) {
        console.error("Get Messages Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};