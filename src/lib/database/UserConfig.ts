import mongoose, { Document } from "mongoose";

export interface DBUserSettings {
    /**
     * Can the user receive game invites (chess, tictactoe, etc.)
     */
    allowGameInvites: boolean;
    /**
     * Is this the first time of the user using the chatbot?
     */
    chatbotFirstTime: boolean;
    /**
     * The birthday setings of the user
     */
    birthday: {
        /**
         * The day and month, format: DD-MM
         */
        day: string;
        /**
         * The year, format: YYYY
         */
        year: number;
    };
    /**
     * Should the messages that get muted for protected ping be deleted?
     */
    deleteProtectedMutes: boolean;
}

export interface DBUser {
    /**
     * The user's id
     */
    userId: string;
    /**
     * The first time the user joined the server (in seconds)
     */
    firstjoined: number;
    /**
     * The last time the user joined the server (in seconds)
     */
    lastjoined: number;
    /**
     * If the user is in the guild
     */
    inguild: boolean;
    /**
     * If the user is muted
     */
    muted: boolean;
    /**
     * If the user is banned
     */
    banned: boolean;
    /**
     * The user's mod level
     */
    mod: number;
    /**
     * If the user is banned from tickets (currently unused)
     */
    ticketban: boolean;
    /**
     * The user's settings
     */
    settings: DBUserSettings;
    /**
     * The invite code the user joined with
     */
    joinedWith: string;
}

export interface IDBUser extends DBUser, Document {}

export const UserConfigSchema = new mongoose.Schema<IDBUser>({
    userId: {
        type: mongoose.SchemaTypes.String,
        unique: true,
        required: true
    },
    firstjoined: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    lastjoined: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    inguild: {
        type: mongoose.SchemaTypes.Boolean,
        default: true
    },
    muted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    banned: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    mod: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    ticketban: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    settings: {
        allowGameInvites: {
            type: mongoose.SchemaTypes.Boolean,
            default: true
        },
        chatbotFirstTime: {
            type: mongoose.SchemaTypes.Boolean,
            default: true
        },
        birthday: {
            day: {
                type: mongoose.SchemaTypes.String,
                default: ""
            },
            year: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            default: {}
        },
        deleteProtectedMutes: {
            type: mongoose.SchemaTypes.Boolean,
            default: true
        }
    },
    joinedWith: {
        type: mongoose.SchemaTypes.String,
        default: "unknown"
    }
});
