import express, { Router, Request, Response } from 'express';
import { Category } from '../types/category';
import { CategoryRepository } from '../repositories/CategoryRepository';
import { DatabaseService } from '../services/DatabaseService';
import { injectable, inject } from 'inversify';
import TYPES from '../types';

@injectable()
class CategoryController {
    public router: Router = express.Router();
    private categoryRepository: CategoryRepository;

    constructor(
        @inject(TYPES.DatabaseService) databaseService: DatabaseService
    ) {
        this.categoryRepository = new CategoryRepository(databaseService);
        this.initializeRoutes();
    }

    private bindRoutes(routes: Array<{ path: string; method: string; fn: (req: Request, res: Response) => void }>) {
        routes.forEach(route => {
            switch(route.method) {
                case 'get':
                    this.router.get(route.path, route.fn);
                    break;
                case 'post':
                    this.router.post(route.path, route.fn);
                    break;
                case 'put':
                    this.router.put(route.path, route.fn);
                    break;
                case 'delete':
                    this.router.delete(route.path, route.fn);
                    break;
                default:
                    console.error(`Method ${route.method} is not supported`);
            }
        });
    }
    

    private initializeRoutes() {
        this.bindRoutes([
            {
                path: '/',
                method: 'get',
                fn: this.getAllCategories,
            },
            {
                path: '/',
                method: 'post',
                fn: this.addCategory,
            },
            {
                path: '/:categoryId',
                method: 'put',
                fn: this.editCategory,
            },
            {
                path: '/:categoryId',
                method: 'delete',
                fn: this.deleteCategory,
            }
        ]);
    }

    private getAllCategories = async (req: Request, res: Response) => {
        try {
            const categories = await this.categoryRepository.findAll();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    };

    private addCategory = async (req: Request, res: Response) => {
        try {
            const category: Category = req.body;
            await this.categoryRepository.create(category);
            res.status(201).json({ message: 'Category added successfully.' });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    };

    private editCategory = async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId);
            const category: Category = req.body;
            await this.categoryRepository.edit(categoryId, category);
            res.json({ message: 'Category updated successfully.' });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    };
    

    private deleteCategory = async (req: Request, res: Response) => {
        try {
            const categoryId = parseInt(req.params.categoryId);
            await this.categoryRepository.remove(categoryId);
            res.json({ message: 'Category deleted successfully.' });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    };
    
}

export { CategoryController };
