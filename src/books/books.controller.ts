import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBooksRequestDto } from './dto/create-books-request.dto';
import { Book } from './entity/book.entity';
import { UpdateBookRequestDto } from './dto/update-book-request.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getBooks(
    @Query('title') title: string,
    @Query('author') author: string,
    @Query('category') category: string,
    @Query('year') year: number,
  ): Promise<Book[]> {
    return this.booksService.getBooks(title, author, category, year);
  }

  @Get('/:id')
  async getBookById(@Param('id', ParseIntPipe) id: bigint): Promise<Book> {
    return this.booksService.getBookById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() request: CreateBooksRequestDto): Promise<Book> {
    return this.booksService.createBook(request);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id', ParseIntPipe) id: bigint,
    @Body() request: UpdateBookRequestDto,
  ) {
    return this.booksService.updateBook(id, request);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: bigint) {
    return this.booksService.deleteBook(id);
  }
}
