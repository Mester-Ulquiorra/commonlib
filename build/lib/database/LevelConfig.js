import mongoose from "mongoose";
export const LevelConfigSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true,
    },
    xp: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
    },
});
