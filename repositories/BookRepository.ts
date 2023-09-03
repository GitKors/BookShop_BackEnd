import { Book } from '../types/book';
import { DatabaseService } from '../services/DatabaseService';
import { injectable, inject } from 'inversify';
import TYPES from '../types';

@injectable()
export class BookRepository {
    private dbService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) dbService: DatabaseService) {
        this.dbService = dbService;
    }
  

    // Найти все книги
    async findAll(): Promise<Book[]> {
        const query = `
            SELECT 
                b."id", 
                b."title", 
                b."price", 
                b."coverUrl", 
                b."description",
                a."name" as authorName,
                c."name" as categoryName,
                COALESCE(AVG(r."value"), 0) as averageRating
            FROM "Book" b
            LEFT JOIN "Author" a ON b."authorId" = a."id"
            LEFT JOIN "Category" c ON b."categoryId" = c."id"
            LEFT JOIN "Rating" r ON b."id" = r."bookId"
            GROUP BY b."id", b."title", b."price", b."coverUrl", b."description", a."name", c."name"
        `;
    
        const booksData = await this.dbService.query(query);
        return booksData;
    }

    // Найти книгу по ID
    async findById(bookId: number): Promise<Book | null> {

    
        const query = 'SELECT * from "Book" WHERE "id" = $1';
        const result = await this.dbService.query(query, [bookId]);
        
        console.log(`Looking for a book with ID: ${bookId}`);
    
        if (result.length) return result[0];
        return null;
    }

// Добавить новую книгу
async create(book: Book): Promise<void> {
    console.log(book);
    if (book.authorId) {

        const authorExistsQuery = 'SELECT EXISTS(SELECT 1 FROM "Author" WHERE "id" = $1)';
        console.log("Checking if author exists with ID:", book.authorId);
        const result = await this.dbService.query(authorExistsQuery, [book.authorId]);
        const authorExists = result[0].exists; 
        console.log("Author exists:", authorExists);

        if (!authorExists && !book.authorName) {
            throw new Error("Author with given ID does not exist and no author name provided.");
        }
    } 

    if (!book.authorId && book.authorName) {

        const insertAuthorQuery = `
            INSERT INTO "Author" ("name") 
            VALUES ($1) 
            ON CONFLICT ("name") DO NOTHING 
            RETURNING "id";
        `;

        const authorResult = await this.dbService.query(insertAuthorQuery, [book.authorName]);
        
        if (authorResult.length) {
            book.authorId = authorResult[0].id;
        } else {
            throw new Error("Failed to create or get authorId.");
        }
    } 

    if (!book.authorId) {
        throw new Error("Both authorId and authorName are missing.");
    }

    const insertBookQuery = `
        INSERT INTO "Book" ("title", "authorId", "categoryId", "description", "price", "coverUrl")
        VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await this.dbService.query(insertBookQuery, [book.title, book.authorId, book.categoryId, book.description, book.price, book.coverUrl]);
}






    // Обновить существующую книгу
    async edit(bookId: number, book: Book): Promise<void> {
        const query = `
            UPDATE "Book"
            SET "title" = $1, "author" = $2, "category" = $3
            WHERE "id" = $4
        `;
        await this.dbService.query(query, [book.title, book.author, book.category, bookId]);
    }

    // Удалить книгу
    async remove(bookId: number): Promise<void> {
        const query = `
            DELETE FROM "Book" WHERE "id" = $1
        `;
        console.log(`Attempting to delete book with ID: ${bookId}`);
        await this.dbService.query(query, [bookId]);
        console.log(`Deleting book with ID: ${bookId}`);
    }
    

    async setRating(userId: number, bookId: number, rating: number): Promise<void> {

        const query = `
            INSERT INTO "Rating" ("userId", "bookId", "rating")
            VALUES ($1, $2, $3)
        `;
        await this.dbService.query(query, [userId, bookId, rating]);
    }
}
