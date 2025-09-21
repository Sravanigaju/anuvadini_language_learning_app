const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        default: '#FF6B6B' 
    },
    order: { 
        type: Number, 
        default: 0 
    },
    archived: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Goal', GoalSchema);
