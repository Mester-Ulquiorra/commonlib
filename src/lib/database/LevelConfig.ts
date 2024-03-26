import mongoose, { Document } from "mongoose";

export interface DBLevel {
    /**
     * The user's id
     */
    userId: string;
    /**
     * The user's xp
     */
    xp: number;
}

export interface IDBLevel extends DBLevel, Document {}

export const LevelConfigSchema = new mongoose.Schema<IDBLevel>({
    userId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true
    },
    xp: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    }
});
