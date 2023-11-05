import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateBookRequestDto {
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
