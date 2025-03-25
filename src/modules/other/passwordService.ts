import bcrypt from 'bcrypt'
import { injectable } from 'inversify';

@injectable()
export class PasswordService {
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  }
}