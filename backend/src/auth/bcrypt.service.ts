import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compare(clientPassword: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(clientPassword, hashedPassword);
    return isMatch;
  }
}
