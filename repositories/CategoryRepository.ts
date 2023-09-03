import { Category } from '../types/category';
import { DatabaseService } from '../services/DatabaseService';
import { injectable, inject } from 'inversify';
import TYPES from '../types';

@injectable()
export class CategoryRepository {
    private dbService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) dbService: DatabaseService) {
        this.dbService = dbService;
    }

    async findAll(): Promise<Category[]> {
        const categoriesList = await this.dbService.query('SELECT * from "Category"');
        return categoriesList;
    }

    async create(category: Category): Promise<void> {
        const query = `
            INSERT INTO "categories" (name)
            VALUES ($1)
        `;
        await this.dbService.query(query, [category.name]);
    }

    async edit(categoryId: number, category: Category): Promise<void> {
        const query = `
            UPDATE "categories" SET name = $1 WHERE id = $2
        `;
        await this.dbService.query(query, [category.name, categoryId]);
    }

    async remove(categoryId: number): Promise<void> {
        const query = `
            DELETE FROM "categories" WHERE id = $1
        `;
        await this.dbService.query(query, [categoryId]);
    }
}
