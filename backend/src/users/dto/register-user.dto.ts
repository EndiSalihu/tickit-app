import { IsNotEmpty, IsString, IsStrongPassword, Matches, Length, IsEmail, IsOptional } from 'class-validator';
export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 155)
  @Matches(/^[a-zA-Z\s]*$/, { message: 'Username can only contain alphabetic characters and spaces.' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1, minSymbols: 1 })
  @IsString()
  password: string;
}
