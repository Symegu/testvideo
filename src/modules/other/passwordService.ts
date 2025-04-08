import bcrypt from 'bcrypt'
import { injectable } from 'inversify';
import { ResultStatus } from '../../types/input-output-types/output-errors-type';
import { SecurityRepository } from '../security/securityRepository';
import { UsersService } from '../users/usersService';
import { UsersRepository } from '../users/usersRepository';

@injectable()
export class PasswordService {
  constructor(
    protected securityRepository: SecurityRepository,
    protected usersService: UsersService,
    protected usersRepository: UsersRepository
  ) { }
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  }

  async createRecoveryCode(id: string) {
    const code = await this.securityRepository.createRandomUID()

    // const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Код действует 15 минут

    const res = await this.securityRepository.createRecoveryCode(id, code)
    return {
      status: ResultStatus.Success,
      data: code,
      extensions: [],
    }
  }

  async confirmPassword(
    code: string
  ) {

    const record = await this.securityRepository.findRecoveryCode(code)

    if (!record) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'code', message: 'Incorrect code' }
        ],
      }
    }

    return {
      status: ResultStatus.Success,
      data: { userId: record.userId },
      extensions: [],
    }
  }

  async changePassword(id: string, providedPassword: string) {
    const res = await this.usersRepository.changeUserPassword(id, providedPassword)
    if (!res) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'providedPassword', message: 'Incorrect providedPassword' }
        ],
      }
    }

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }

  async deleteRecoveryCode(code: string) {
    const res = await this.securityRepository.deleteRecoveryCode(code)
    if (!res) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'providedPassword', message: 'Incorrect deleteRecoveryCode' }
        ],
      }
    }
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }
}