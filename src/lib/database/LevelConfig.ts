import mongoose, { Document } from "mongoose";
import { DBLevel } from "../types/Database.js";

export interface IDBLevel extends DBLevel, Document { }

export const LevelConfigSchema = new mongoose.Schema<IDBLevel>({
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