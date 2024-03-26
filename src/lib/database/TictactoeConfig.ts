import mongoose, { Document } from "mongoose";

export interface DBTictactoe {
    /**
     * The user's id
     */
    user: string;
    /**
     * The user's played games
     */
    gamesPlayed: number;
    /**
     * The user's won games
     */
    gamesWon: number;
    /**
     * The user's lost games
     */
    gamesLost: number;
    /**
     * The user's elo
     */
    elo: number;
}

export interface IDBTictactoe extends DBTictactoe, Document {}

export const TictactoeConfigSchema = new mongoose.Schema<IDBTictactoe>({
    user: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    gamesPlayed: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    gamesWon: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    gamesLost: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    elo: {
        type: mongoose.SchemaTypes.Number,
        default: 1000
    }
});
