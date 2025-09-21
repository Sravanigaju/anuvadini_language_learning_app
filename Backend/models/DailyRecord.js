const mongoose = require('mongoose');

const DailyRecordSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    date: { 
        type: String, 
        required: true, 
        index: true 
    }, // 'YYYY-MM-DD' in user's local date
    completedGoalIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Goal' 
    }], // IDs of goals completed that date
    completedSnapshots: [{
        goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
        title: { type: String, required: true },
        completedAt: { type: Date, default: Date.now }
    }], // Optional: preserve title snapshot for immutable history
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Create unique index for userId + date combination
DailyRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

// Update updatedAt timestamp on save
DailyRecordSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('DailyRecord', DailyRecordSchema);
