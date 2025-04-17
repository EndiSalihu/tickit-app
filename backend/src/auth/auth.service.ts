import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

// dtos
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { BcryptService } from './bcrypt.service';
import { Token } from './interfaces/token.interface';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  createRefreshToken(): string {
    return this.jwtService.sign({}, { expiresIn: '7d' }); 
  }


  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
  
    if (!user) {
      console.log('User not found for email:', email);
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isPasswordValid = await this.bcryptService.compare(password,user.password);
  
    if (!isPasswordValid) {
      console.log('Password does not match for user:', email);
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return user;
  }


  async register(body: RegisterUserDto): Promise<{ access_token: string }> {
    const userEmail = await this.usersRepository.findOneBy({ email: body.email });

    if (userEmail) throw new NotFoundException('User already exists!');

    const hashedPassword = await this.bcryptService.hash(body.password);

    const user = this.usersRepository.create({ ...body, password: hashedPassword });

    await this.usersRepository.save(user);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }


  async refreshAccessToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const payload = { sub: decoded.sub, email: decoded.email };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token has expired');
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }


  async login(body: LoginUserDto): Promise<Token> {
    const user = await this.validateUser(body.email, body.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.createRefreshToken();

    return { access_token: token, refresh_token: refreshToken };
  }
}
