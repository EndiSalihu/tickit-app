import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// dtos
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/user.entity';
import { Token } from './interfaces/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async signUp(@Body() body: RegisterUserDto): Promise<{ access_token: string }> {
    return this.authService.register(body);
  }

  @Post('login')
  public async signIn(@Body() body: LoginUserDto): Promise<Token> {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async getMe(@Req() req: any): Promise<User> {
    console.log(req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  public async signOut(@Req() req: any) {
    if (req.user) {
      console.log('Logging out user:', req.user);
      return {
        message:
          'User logged out successfully. Please remove the token from your client storage.',
      };
    }
  }
}
