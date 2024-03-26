import mongoose, { Document } from "mongoose";

export interface DBTicket {
    /**
     * The ticket's id
     */
    ticketId: string;
    /**
     * The channel's id that serves as the ticket
     */
    channel: string;
    /**
     * The user's id who created the ticket
     * -1 = it was automatically created by the bot
     */
    creator: string;
    /**
     * The moderator's id who claimed the ticket
     */
    mod: string;
    /**
     * The minimum mod level required to claim the ticket
     */
    modlevel: number;
    /**
     * The mod level this ticket is waiting for (0 if not waiting for a mod)
     */
    waitingfor: number;
    /**
     * The type of ticket
     */
    type: TicketType;
    /**
     * The users of the ticket who were manually added
     */
    users: Map<string, string>;
    /**
     * If the ticket is closed
     */
    closed: boolean;
    /**
     * The time the ticket was closed (in seconds)
     */
    closedat: number;
}

/**
 * private = a private ticket opened by a mod
 * general = a general ticket opened by a user
 * modR = a mod report ticket
 * userR = a user report ticket
 * feedback = used for suggestions, feedback and bug reports
 */
export const TicketTypes = <const>["private", "general", "userR", "modR", "feedback"];
export type TicketType = (typeof TicketTypes)[number];

export interface IDBTicket extends DBTicket, Document {}

export const TicketConfigSchema = new mongoose.Schema<IDBTicket>({
    ticketId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true
    },
    channel: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true
    },
    creator: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    mod: {
        type: mongoose.SchemaTypes.String,
        default: "-1" // -1 means the ticket is not claimed
    },
    modlevel: {
        type: mongoose.SchemaTypes.Number,
        default: 0 // determines what mods should be abe to see this ticket
    },
    waitingfor: {
        type: mongoose.SchemaTypes.Number,
        default: 1 // which mod the ticket is currently waiting for
    },
    type: {
        type: mongoose.SchemaTypes.String,
        default: "general"
    },
    users: {
        type: mongoose.SchemaTypes.Map,
        of: mongoose.SchemaTypes.String,
        default: new Map<string, string>()
    },
    closed: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    closedat: {
        type: mongoose.SchemaTypes.Number,
        default: -1
    }
});
