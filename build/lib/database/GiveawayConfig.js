import mongoose, { SchemaTypes } from "mongoose";
export const GiveawayConfigSchema = new mongoose.Schema({
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
