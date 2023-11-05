import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entity/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBooksRequestDto } from './dto/create-books-request.dto';
import { UpdateBookRequestDto } from './dto/update-book-request.dto';

@Injectable()
export class BooksService {
  customBookRepository = this.bookRepository.extend({
    findByQueryParameter(
      title: string,
      author: string,
      category: string,
      year: number,
    ) {
      const query = this.createQueryBuilder('book');

      if (title) {
        query.andWhere('book.title LIKE :title', {
          title: `%${title}%`,
        });
      }

      if (author) {
        query.andWhere('book.author LIKE :author', {
          author: `%${author}%`,
        });
      }

      if (category) {
        query.andWhere('book.category LIKE :category', {
          category: `%${category}%`,
        });
      }

      if (year) {
        query.andWhere('book.year = :year', { year });
      }

      return query.getMany();
    },
  });

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async getBooks(
    title: string,
    author: string,
    category: string,
    year: number,
  ): Promise<Book[]> {
    return this.customBookRepository.findByQueryParameter(
      title,
      author,
      category,
      year,
    );
  }

  async getBookById(id: bigint): Promise<Book> {
    const book = await this.bookRepository.findOneBy({
      id,
    });

    if (!book) {
      throw new NotFoundException('book');
    }

    return book;
  }

  async createBook(request: CreateBooksRequestDto): Promise<Book> {
    return await this.bookRepository.manager.transaction(async (manager) => {
      const book = this.bookRepository.create();
      book.title = request.title;
      book.author = request.author;
      book.category = request.category;
      book.year = request.year;

      return await manager.save(book);
    });
  }

  async updateBook(id: bigint, request: UpdateBookRequestDto): Promise<Book> {
    return await this.bookRepository.manager.transaction(async (manager) => {
      const book = await manager.findOneBy(Book, { id });

      if (!book) {
        throw new NotFoundException('book');
      }

      book.year = request.year;
      book.author = request.author;
      book.title = request.title;
      book.category = request.category;

      return manager.save(book);
    });
  }

  async deleteBook(id: bigint): Promise<void> {
    return await this.bookRepository.manager.transaction(async (manager) => {
      const book = await manager.findOneBy(Book, { id });

      if (!book) {
        throw new NotFoundException('book');
      }

      await manager.remove(book);
    });
  }
}
