import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBooksRequestDto } from './dto/create-books-request.dto';
import { UpdateBookRequestDto } from './dto/update-book-request.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getBooks(
    @Query('title') title: string,
    @Query('author') author: string,
    @Query('category') category: string,
  ) {
    return this.booksService.getBooks(title, author, category);
  }

  @Get('/:id')
  readSingle(@Param('id') id: string) {
    return this.booksService.getSingleBook(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() request: CreateBooksRequestDto) {
    return this.booksService.createBooks(request);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() request: UpdateBookRequestDto) {
    return this.booksService.updateBooks(id, request);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.booksService.deleteBook(id);
  }
}
