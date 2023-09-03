import { Pool } from 'pg';
import { injectable } from 'inversify';

@injectable()
export class DatabaseService {
    private pool: Pool;

    constructor() {
        const connectionString = process.env.DATABASE_URL;


        this.pool = new Pool({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    async query(sql: string, values?: any[]): Promise<any[]> {

        if (values && values.length > 0) {
            console.log('With values:', values);
        }

        try {
            const res = await this.pool.query(sql, values);
            return res.rows;
        } catch (error) {
            if (error instanceof Error) {
                console.error("Ошибка при выполнении SQL-запроса:", error.message);
            } else {
                console.error("Неизвестная ошибка:", error);
            }
            throw error;
        }
            
        }
    }

