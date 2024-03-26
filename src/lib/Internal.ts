import { createCipheriv, createDecipheriv, randomFillSync, scryptSync } from "node:crypto";
import { Server, connect, createServer } from "net";
import * as yup from "yup";
import { DBPunishment } from "../index.js";

export type InternalMessageType = "createAppeal" | "muteUser" | "appealProcessed" | "punishment";
export type InternalMessageData<T extends InternalMessageType> = T extends "createAppeal"
    ? { punishmentId: string; reason: string; additional: string }
    : T extends "muteUser"
    ? { userId: string; mod: string; reason: string; duration: number }
    : T extends "appealProcessed"
    ? { punishmentId: string; status: "accepted" | "rejected"; reason: string }
    : T extends "punishment"
    ? Omit<DBPunishment, "automated">
    : never;

export interface InternalMessage<T extends InternalMessageType> {
    type: T;
    data: InternalMessageData<T>;
}

export enum InternalEndpoints {
    BOT = 5658,
    API = 5659
}

// ---- Setup yup schemas ----
const createAppealSchema = yup.object({
    type: yup.string().oneOf(["createAppeal"]).required(),
    data: yup
        .object({
            punishmentId: yup.string().required(),
            reason: yup.string().required().min(128).max(1024),
            additional: yup.string().notRequired().max(1024)
        })
        .required()
});

const muteUserSchema = yup.object({
    type: yup.string().oneOf(["muteUser"]).required(),
    data: yup
        .object({
            userId: yup.string().required(),
            mod: yup.string().required(),
            reason: yup.string().required(),
            duration: yup.number().required()
        })
        .required()
});

const appealProcessedSchema = yup.object({
    type: yup.string().oneOf(["appealProcessed"]).required(),
    data: yup
        .object({
            punishmentId: yup.string().required(),
            status: yup.string().oneOf(["accepted", "rejected"]).required(),
            reason: yup.string().required()
        })
        .required()
});

const punishmentSchema = yup.object({
    type: yup.string().oneOf(["punishment"]).required(),
    data: yup
        .object({
            punishmentId: yup.string().required(),
            user: yup.string().required(),
            mod: yup.string().required(),
            type: yup.number().integer().min(0).max(3).required(),
            reason: yup.string().required(),
            at: yup.number().integer().required(),
            until: yup.number().integer().required(),
            active: yup.boolean().required(),
            appealed: yup.boolean().required()
        })
        .required()
});
// ---------------------------

const InternalMessageSchema = yup.lazy((obj: InternalMessage<InternalMessageType>) => {
    switch (obj.type) {
        case "createAppeal":
            return createAppealSchema;
        case "muteUser":
            return muteUserSchema;
        case "appealProcessed":
            return appealProcessedSchema;
        case "punishment":
            return punishmentSchema;
    }
});

function validateMessage<T extends InternalMessageType>(type: T, data: InternalMessageData<T>) {
    try {
        InternalMessageSchema.validateSync({ type, data });
        return true;
    } catch {
        return false;
    }
}

export class InternalServer {
    server: Server;

    constructor(port: InternalEndpoints, secret: Buffer, onMessage: (message: InternalMessage<InternalMessageType>) => Promise<string>) {
        console.log("Starting internal server");

        this.server = createServer((socket) => {
            socket.on("data", async (data) => {
                const processed = await processInternalMessage(secret, data.toString());
                if (typeof processed === "string") {
                    socket.write(processed);
                    return;
                }

                onMessage(processed).then((res) => {
                    socket.write(res);
                });
            });
        });

        this.server.listen(port);
    }

    stop() {
        this.server.close();
    }
}

/**
 * Send an internal message to a TCP server
 * @param message The message to send
 */
export async function sendInternalMessage<T extends InternalMessageType>(secret: Buffer, message: InternalMessage<T>, port: InternalEndpoints) {
    // generate parameters for encryption
    const iv = randomFillSync(Buffer.alloc(16));
    const salt = randomFillSync(Buffer.alloc(16));

    // encrypt the message
    const key = scryptSync(secret, salt, 32);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    cipher.setAAD(Buffer.from("internal", "utf-8"));
    const encrypted = cipher.update(JSON.stringify(message), "utf-8", "base64") + cipher.final("base64");

    const at = cipher.getAuthTag();

    const final = `${at.toString("base64")}.${iv.toString("base64")}.${salt.toString("base64")}.${encrypted}`;

    // send it to server
    return new Promise<boolean | string>((resolve, reject) => {
        const socket = connect({ port, host: "127.0.0.1" }, () => {
            socket.write(final);
        });

        socket.on("data", (data) => {
            if (data.toString() === "ok") {
                resolve(true);
            } else {
                reject(data.toString());
            }

            socket.end();
        });
    });
}

/**
 * Internal function for processing a message
 * @param publicKey The secret key used to encrypt the message
 * @returns The message if it is valid, otherwise a string with the error
 */
async function processInternalMessage(secret: Buffer, rawMessage: string) {
    try {
        if (rawMessage.split(".").length !== 4) {
            return "Invalid message structure";
        }

        // decode the request
        const [atBase64, ivBase64, saltBase64, payloadBase64] = rawMessage.split(".");
        const at = Buffer.from(atBase64, "base64");
        const iv = Buffer.from(ivBase64, "base64");
        const salt = Buffer.from(saltBase64, "base64");
        const payload = Buffer.from(payloadBase64, "base64");

        // decrypt the message using the secret key
        const key = scryptSync(secret, salt, 32);
        const decipher = createDecipheriv("aes-256-gcm", key, iv);
        decipher.setAuthTag(at);
        decipher.setAAD(Buffer.from("internal", "utf-8"));
        const decrypted = decipher.update(payload);

        // parse the payload as JSON
        const message = JSON.parse(decrypted.toString()) as InternalMessage<InternalMessageType>;

        // validate the message
        if (!validateMessage(message.type, message.data)) {
            return "Invalid message structure";
        }

        return message;
    } catch (err) {
        console.error(err);
        return "Decryption failed";
    }
}

export function isCreateAppealMessage(message: InternalMessage<InternalMessageType>): message is InternalMessage<"createAppeal"> {
    return message.type === "createAppeal";
}

export function isMuteUserMessage(message: InternalMessage<InternalMessageType>): message is InternalMessage<"muteUser"> {
    return message.type === "muteUser";
}

export function isAppealProcessedMessage(message: InternalMessage<InternalMessageType>): message is InternalMessage<"appealProcessed"> {
    return message.type === "appealProcessed";
}

export function isPunishmentMessage(message: InternalMessage<InternalMessageType>): message is InternalMessage<"punishment"> {
    return message.type === "punishment";
}
