import mongoose, { Document, SchemaTypes } from "mongoose";

export interface DBInvite {
    /**
     * The invite's code
     */
    code: string;
    /**
     * The user's id who created the invite
     */
    userId: string;
    /**
     * The total amount of actual uses
     */
    uses: number;
}

export interface IDBInvite extends DBInvite, Document {}

export const InviteConfigSchema = new mongoose.Schema<IDBInvite>({
    code: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    userId: {
        type: SchemaTypes.String,
        required: true
    },
    uses: {
        type: SchemaTypes.Number,
        default: 0
    }
});
