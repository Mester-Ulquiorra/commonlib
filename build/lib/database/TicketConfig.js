import mongoose from "mongoose";
export var TicketType;
(function (TicketType) {
    TicketType[TicketType["Private"] = -1] = "Private";
    TicketType[TicketType["General"] = 0] = "General";
    TicketType[TicketType["MemberReport"] = 1] = "MemberReport";
    TicketType[TicketType["ModReport"] = 2] = "ModReport";
    TicketType[TicketType["HeadModReport"] = 3] = "HeadModReport";
})(TicketType || (TicketType = {}));
export const TicketConfigSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true,
    },
    channel: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true,
    },
    creator: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    mod: {
        type: mongoose.SchemaTypes.String,
        default: "-1",
    },
    modlevel: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
    },
    waitingfor: {
        type: mongoose.SchemaTypes.Number,
        default: 1,
    },
    type: {
        type: mongoose.SchemaTypes.Number,
        default: TicketType.General,
    },
    users: {
        type: mongoose.SchemaTypes.Map,
        of: mongoose.SchemaTypes.String,
        default: new Map(),
    },
    closed: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    closedat: {
        type: mongoose.SchemaTypes.Number,
        default: -1,
    },
});
