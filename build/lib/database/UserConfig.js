import mongoose from "mongoose";
export const UserConfigSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true,
    },
    firstjoined: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    lastjoined: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    inguild: {
        type: mongoose.SchemaTypes.Boolean,
        default: true,
    },
    muted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    banned: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    mod: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
    },
    ticketban: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    settings: {
        allowGameInvites: {
            type: mongoose.SchemaTypes.Boolean,
            default: true,
        },
        chatbotFirstTime: {
            type: mongoose.SchemaTypes.Boolean,
            default: true,
        },
    },
});
