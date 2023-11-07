import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
