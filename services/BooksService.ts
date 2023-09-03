import { Book } from '../types/book';
import { BookRepository } from '../repositories/BookRepository';
import { inject, injectable } from 'inversify';
import TYPES from '../types';

@injectable()
export class BooksService {
  private bookRepository: BookRepository;

  constructor(
    @inject(TYPES.BookRepository) bookRepository: BookRepository
  ) {
    this.bookRepository = bookRepository;
  }

  

  async getBooks(perPage: number, page: number, categories: string[]): Promise<Book[]> {
    // Получение всех книг
    console.log("Received categories:", categories);
    const allBooks = await this.bookRepository.findAll();
    // console.log("All books:", allBooks);
    // allBooks.forEach(book => {
    //   console.log(`Book ID: ${book.id}, Category ID: ${book.categoryId}`);
    // });
  

    // Фильтрация книг по категориям
    const filteredBooks = categories.length 
    ? allBooks.filter(book => book.categoryname && categories.includes(book.categoryname))
    : allBooks;
    
  
    console.log('Filtered books:', filteredBooks);

    const start = page * perPage;
    const end = start + perPage;
    
    console.log("Categories for filtering:", categories);

    return filteredBooks.slice(start, end);
  }

  public async setBookRating(userId: number, bookId: number, rating: number): Promise<void> {
    return this.bookRepository.setRating(userId, bookId, rating);
}

}
