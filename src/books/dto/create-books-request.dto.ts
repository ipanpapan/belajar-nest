import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBooksRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
