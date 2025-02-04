import { faker } from '@faker-js/faker';
import { AuthorModel } from "../../model/author.model";
import { createAuthorController } from "../../controller/author.controller";
import { Database } from 'sqlite3';
import { MessageModel } from '../../model/message.model';

function createRandomAuthor(): AuthorModel {
    const id = 0;
    const name = faker.person.fullName();
    const createdAt = faker.date.past().toLocaleString();

    return { id, name, createdAt };
}

export async function createRandomAuthorsInDatabase(db: Database): Promise<void> {
    for (let i = 0; i < 100; i++) {
        await createAuthorController(db, createRandomAuthor());
    }
} 