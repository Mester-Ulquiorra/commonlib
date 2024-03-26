import mongoose, { Document, SchemaTypes } from "mongoose";

export interface DBGiveaway {
    /**
     * The giveaway's id
     */
    giveawayId: string;
    /**
     * The giveaway's message id
     */
    message: string;
    /**
     * The giveaway's channel id
     */
    channel: string;
    /**
     * The user's id who created the giveaway
     */
    host: string;
    /**
     * The giveaway's name
     */
    name: string;
    /**
     * The time the giveaway was created (in seconds)
     */
    start: number;
    /**
     * The time the giveaway will end (in seconds)
     */
    end: number;
    /**
     * If the giveaway has ended
     */
    ended: boolean;
    /**
     * The number of winners
     */
    winners: number;
    /**
     * The giveaway's filter
     */
    filter: GiveawayFilter;
}

export interface GiveawayFilter {
    /**
     * Are nitro users allowed to be winners?
     */
    nitro: boolean;
}

export interface IDBGiveaway extends DBGiveaway, Document {}

export const GiveawayConfigSchema = new mongoose.Schema<IDBGiveaway>({
    giveawayId: {
        type: SchemaTypes.String,
        unique: true,
        required: true
    },
    message: {
        type: SchemaTypes.String,
        unique: true,
        required: true
    },
    channel: {
        type: SchemaTypes.String,
        required: true
    },
    host: {
        type: SchemaTypes.String,
        required: true
    },
    name: {
        type: SchemaTypes.String,
        required: true
    },
    start: {
        type: SchemaTypes.Number,
        required: true
    },
    end: {
        type: SchemaTypes.Number,
        required: true
    },
    ended: {
        type: SchemaTypes.Boolean,
        default: false
    },
    winners: {
        type: SchemaTypes.Number,
        default: 1
    },
    filter: {
        nitro: {
            type: SchemaTypes.Boolean,
            default: undefined
        },
        default: {}
    }
});
