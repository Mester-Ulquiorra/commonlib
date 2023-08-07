import { createSign, createVerify } from "crypto";
import { NextFunction, Request, Response } from "express";
import yup from "yup";

export type InternalMessageType = "createAppeal" | "muteUser" | "appealProcessed";
export type InternalMessageData<T extends InternalMessageType> = T extends "createAppeal"
    ? { punishmentId: string; reason: string; additional: string }
    : T extends "muteUser"
    ? { userId: string; mod: string; reason: string; duration: number }
    : T extends "appealProcessed"
    ? { punishmentId: string; status: "accepted" | "denied"; reason: string }
    : never;

export interface InternalMessage<T extends InternalMessageType> {
    type: T;
    data: InternalMessageData<T>;
}

// ---- Setup yup schemas ----
const createAppealSchema = yup.object({
    type: yup.string().oneOf(["createAppeal"]).required(),
    data: yup
        .object({
            punishmentId: yup.string().required(),
            reason: yup.string().required().min(128).max(1024),
            additional: yup.string().notRequired().max(1024),
        })
        .required(),
});

const muteUserSchema = yup.object({
    type: yup.string().oneOf(["muteUser"]).required(),
    data: yup
        .object({
            userId: yup.string().required(),
            mod: yup.string().required(),
            reason: yup.string().required(),
            duration: yup.number().required(),
        })
        .required(),
});

const appealProcessedSchema = yup.object({
    type: yup.string().oneOf(["appealProcessed"]).required(),
    data: yup
        .object({
            punishmentId: yup.string().required(),
            status: yup.string().oneOf(["accepted", "denied"]).required(),
            reason: yup.string().required(),
        })
        .required(),
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

/**
 * Send an internal message to a http endpoint
 * @param message The message to send
 */
export async function sendInternalMessage<T extends InternalMessageType>(
    privateKey: Buffer,
    message: InternalMessage<T>,
    endpoint: string
) {
    // serialise the message into an ArrayBuffer
    const messageBuffer = Buffer.from(JSON.stringify(message), "utf-8");

    // sign data
    const sign = createSign("RSA-SHA256");
    sign.update(messageBuffer);
    sign.end();

    const signature = sign
        .sign({
            key: privateKey,
        })
        .toString("base64");

    const final = `${signature}.${messageBuffer.toString("base64")}`;

    const success = await fetch(endpoint, {
        method: "POST",
        body: final,
        headers: {
            "Content-Type": "text/plain",
        },
    })
        .then((res) => {
            if (!res.ok) {
                return false;
            }

            return true;
        })
        .catch(() => {
            return false;
        });

    return success;
}

export interface RequestWithMessage extends Request {
    message: InternalMessage<InternalMessageType>;
}

/**
 * Express middleware to read an internal message from a request
 * @param publicKey The public key to verify the message with
 * @returns The message if it is valid, otherwise a string with the error
 */
export const processInternalMessage = (publicKey: Buffer) => async (req: RequestWithMessage, res: Response, next: NextFunction) => {
    // decode the request body (it was sent as string that is signaturebase64.payloadbase64)
    const [signatureBase64, payloadBase64] = req.body.split(".");
    const signature = Buffer.from(signatureBase64, "base64");
    const payload = Buffer.from(payloadBase64, "base64");

    // verify the signature with nodejs crypto
    const verify = createVerify("RSA-SHA256");
    verify.update(payload);
    verify.end();
    if (!verify.verify(publicKey, signature)) {
        return res.status(400).send("Invalid signature");
    }

    // parse the payload as JSON
    const message = JSON.parse(payload.toString()) as InternalMessage<InternalMessageType>;

    // validate the message
    if (!validateMessage(message.type, message.data)) {
        return res.status(400).send("Invalid message");
    }

    req.message = message;

    next();
};

export function isCreateAppealMessage(message: InternalMessage<InternalMessageType>): message is InternalMessage<"createAppeal"> {
    return message.type === "createAppeal";
}

export function isMuteUserMessage(message: InternalMessage<InternalMessageType>): message is InternalMessage<"muteUser"> {
    return message.type === "muteUser";
}
