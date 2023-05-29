import mongoose from "mongoose";
export var PunishmentType;
(function (PunishmentType) {
    PunishmentType[PunishmentType["Warn"] = 0] = "Warn";
    PunishmentType[PunishmentType["Mute"] = 1] = "Mute";
    PunishmentType[PunishmentType["Kick"] = 2] = "Kick";
    PunishmentType[PunishmentType["Ban"] = 3] = "Ban";
})(PunishmentType || (PunishmentType = {}));
export function PunishmentTypeToName(type) {
    switch (type) {
        case PunishmentType.Warn:
            return "Warn";
        case PunishmentType.Mute:
            return "Mute";
        case PunishmentType.Kick:
            return "Kick";
        case PunishmentType.Ban:
            return "Ban";
    }
}
export const PunishmentConfigSchema = new mongoose.Schema({
    punishmentId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true,
    },
    user: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    mod: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    type: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    reason: {
        type: mongoose.SchemaTypes.String,
        default: "No reason",
    },
    at: {
        type: mongoose.SchemaTypes.Number,
        required: true,
    },
    until: {
        type: mongoose.SchemaTypes.Number,
        default: -1,
    },
    active: {
        type: mongoose.SchemaTypes.Boolean,
        default: true,
    },
    automated: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
    },
    appealed: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    }
});
