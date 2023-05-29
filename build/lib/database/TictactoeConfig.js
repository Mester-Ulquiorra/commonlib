import mongoose from "mongoose";
export const TictactoeConfigSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    gamesPlayed: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
    },
    gamesWon: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
    },
    gamesLost: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
    },
    elo: {
        type: mongoose.SchemaTypes.Number,
        default: 1000,
    }
});
