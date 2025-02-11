import { beforeEach, vi, describe, it, expect, afterEach } from "vitest";
import * as messageController from "./message.controller.ts";
import * as authorController from "../controller/author.controller.ts";
import * as letterCounterController from "./letterCounter.controller.ts";
import { createTables } from "../database/tables.ts";
import sqlite3, { Database } from "sqlite3";
import { MessageModel } from "../model/message.model.ts";
import { DatabaseError } from "../middleware/databaseError.handler.ts";
import { AuthorModel } from "../model/author.model.ts";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import * as messageCreateEventController from "./messageCreateEvent.controller.ts";

let db: Database;
const createdAtTime = new Date().toLocaleString();

describe("messageCreateEvent.controller tests", () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
        db = new sqlite3.Database(":memory:");
        await createTables(db);
    });

    afterEach(() => {
        db.close();
        vi.restoreAllMocks();
    });

    describe("logDiscordMessage tests", async () => {
        it('should create an AuthorModel from the message parameter and call createAuthorController with it', async () => {
            const message = { author: { displayName: "Teszt Elek" }, createdAt: createdAtTime, content: "Teszt" } as unknown as OmitPartialGroupDMChannel<Message<boolean>>;
            const authorToCreate: AuthorModel = { id: 0, name: message.author.displayName, createdAt: message.createdAt.toLocaleString() };
            vi.spyOn(authorController, 'createAuthorController');

            await messageCreateEventController.logDiscordMessage(db, message);
            expect(authorController.createAuthorController).toHaveBeenCalledWith(db, authorToCreate);
        })

        it('should create a MessageModel from the message parameter and call createMessageController with it', async () => {
            const message = { author: { displayName: "Teszt Elek" }, createdAt: createdAtTime, content: "Teszt" } as unknown as OmitPartialGroupDMChannel<Message<boolean>>;
            const messageToCreate: MessageModel = { id: 0, authorId: 1, content: "Teszt", messageCreatedAt: message.createdAt.toLocaleString() };
            vi.spyOn(messageController, 'createMessageController');

            await messageCreateEventController.logDiscordMessage(db, message);
            expect(messageController.createMessageController).toHaveBeenCalledWith(db, messageToCreate);
        })

        it('should create a MessageModel from the message parameter and call createLetterCountersController with it', async () => {
            const message = { author: { displayName: "Teszt Elek" }, createdAt: createdAtTime, content: "Teszt" } as unknown as OmitPartialGroupDMChannel<Message<boolean>>;
            const messageToCreate: MessageModel = { id: 0, authorId: 1, content: "Teszt", messageCreatedAt: message.createdAt.toLocaleString() };
            vi.spyOn(letterCounterController, 'createLetterCountersController');

            await messageCreateEventController.logDiscordMessage(db, message);
            expect(letterCounterController.createLetterCountersController).toHaveBeenCalledWith(db, messageToCreate);
        })

        it('should throw an error with the correct message', async () => {
            const message = { author: { displayName: "Teszt Elek" }, createdAt: createdAtTime, content: "Teszt" } as unknown as OmitPartialGroupDMChannel<Message<boolean>>;
            vi.spyOn(messageCreateEventController, 'logDiscordMessage').mockRejectedValue(new DatabaseError("Error logging message:", 500));

            await expect(messageCreateEventController.logDiscordMessage(db, message)).rejects.toThrow(DatabaseError);
            await expect(messageCreateEventController.logDiscordMessage(db, message)).rejects.toThrow("Error logging message");
        })
    })
})