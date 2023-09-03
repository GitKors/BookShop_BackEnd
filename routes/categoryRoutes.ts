import express, { Router, Request, Response } from 'express';
import { Category } from '../types/category';

import { CategoryRepository } from '../repositories/CategoryRepository';
import { DatabaseService } from '../services/DatabaseService';

const categoryRepository = new CategoryRepository(new DatabaseService());
const router: Router = express.Router();

// Получение списка всех категорий
router.get('/', async (req: Request, res: Response) => {
    try {
        const categories = await categoryRepository.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).send('Ошибка получения списка категорий');
    }
});

// Добавление категории
router.post('/', async (req: Request, res: Response) => {
    try {
        const newCategory: Category = req.body;
        await categoryRepository.create(newCategory);
        res.status(201).send('Категория успешно добавлена');
    } catch (error) {
        res.status(500).send('Ошибка добавления категории');
    }
});

// Редактирование категории
router.put('/:categoryId', async (req: Request, res: Response) => {
    const categoryId: number = parseInt(req.params.categoryId, 10);
    const updatedCategory: Category = req.body;
    try {
        await categoryRepository.edit(categoryId, updatedCategory);
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).send('Ошибка редактирования категории');
    }
});

// Удаление категории
router.delete('/:categoryId', async (req: Request, res: Response) => {
    const categoryId: number = parseInt(req.params.categoryId, 10);
    try {
        await categoryRepository.remove(categoryId);
        res.send('Категория успешно удалена');
    } catch (error) {
        res.status(500).send('Ошибка удаления категории');
    }
});

export default router;
