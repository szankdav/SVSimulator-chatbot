import { fakerHU } from '@faker-js/faker';
import { AuthorModel } from "../../model/author.model";
import { createAuthorController, getAuthorByNameController } from "../../controller/author.controller";
import { Database } from 'sqlite3';
import { MessageModel } from '../../model/message.model';
import { createMessageController } from '../../controller/message.controller';
import { createLetterCountersController } from '../../controller/letterCounter.controller';

export function createRandomAuthor(): AuthorModel {
    const id = 0;
    const name = fakerHU.person.fullName();
    const createdAt = fakerHU.date.past().toLocaleString();

    return { id, name, createdAt };
}

export function createRandomMessage(overwrites: Partial<MessageModel> = {}): MessageModel {
    const {
        id = 0,
        authorId = 0,
        content = fakerHU.lorem.sentences(),
        messageCreatedAt = fakerHU.date.past().toLocaleString(),
    } = overwrites

    return { id, authorId, content, messageCreatedAt };
}

export async function createRandomAuthorsInDatabase(db: Database): Promise<void> {
    for (let i = 0; i < 100; i++) {
        const randomAuthor = createRandomAuthor();
        await createAuthorController(db, randomAuthor);
        const randomMessageNumber = Math.floor(Math.random() * (20 - 1 + 1) + 1);
        for (let j = 0; j < randomMessageNumber; j++) {
            const createdAuthor = await getAuthorByNameController(db, randomAuthor.name);
            const createdRandomMessage = createRandomMessage({ authorId: createdAuthor?.id });
            await createMessageController(db, createdRandomMessage);
            await createLetterCountersController(db, createdRandomMessage);
        }
    }
} 