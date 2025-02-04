import { faker } from '@faker-js/faker';
import { AuthorModel } from "../../model/author.model";
import { createAuthorController } from "../../controller/author.controller";
import { Database } from 'sqlite3';

function createRandomAuthor(): AuthorModel {
    const id = 0;
    const name = faker.person.fullName();
    const createdAt = faker.date.past().toLocaleString();

    return {id, name, createdAt};
}

export async function createRandomAuthorsInDatabase(db: Database): Promise<void> {
    await createAuthorController(db, createRandomAuthor());
} 