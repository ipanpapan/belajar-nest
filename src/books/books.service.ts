import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateBooksRequestDto } from './dto/create-books-request.dto';
import { UpdateBookRequestDto } from './dto/update-book-request.dto';

@Injectable()
export class BooksService {
  private books = [
    {
      id: v4(),
      title: 'book satu',
      author: 'author satu',
      category: 'category satu',
      year: 1234,
    },
    {
      id: v4(),
      title: 'book dua',
      author: 'author dua',
      category: 'category dua',
      year: 1235,
    },
  ];

  getBooks(title: string, author: string, category: string): any[] {
    return this.books.filter((oneBook) => {
      let isMatch = true;

      if (title && title != oneBook.title) {
        isMatch = false;
      }

      if (author && author != oneBook.author) {
        isMatch = false;
      }

      if (category && category != oneBook.category) {
        isMatch = false;
      }

      return isMatch;
    });
  }

  getSingleBook(id: string): any {
    const bookIndex = this.findBooksIndexById(id);

    if (bookIndex === -1) {
      throw new NotFoundException('book');
    }

    return this.books[bookIndex];
  }

  createBooks(request: CreateBooksRequestDto): any {
    const newBook = {
      id: v4(),
      title: request.title,
      author: request.author,
      category: request.category,
      year: request.year,
    };

    this.books.push(newBook);

    return newBook;
  }

  updateBooks(id: string, request: UpdateBookRequestDto): any {
    const bookIndex = this.findBooksIndexById(id);

    if (bookIndex === -1) {
      throw new NotFoundException('book');
    }

    this.books[bookIndex].title = request.title;
    this.books[bookIndex].author = request.author;
    this.books[bookIndex].category = request.category;
    this.books[bookIndex].year = request.year;

    return this.books[bookIndex];
  }

  deleteBook(id: string) {
    const bookIndex = this.findBooksIndexById(id);

    if (bookIndex < 0) {
      throw new NotFoundException('book');
    }

    this.books.splice(bookIndex, 1);
  }

  private findBooksIndexById(id: string): number {
    return this.books.findIndex((book) => {
      return book.id === id;
    });
  }
}
