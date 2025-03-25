import { isBefore, parseISO } from 'date-fns'
import nodemailer from 'nodemailer'
import { SETTINGS } from '../../settings'
import { Result, ResultStatus } from '../../types/input-output-types/output-errors-type'
import { injectable } from 'inversify'
import { EmailRepository } from './emailRepository'
import { UsersQueryRepository } from '../users/usersQueryRepository';

@injectable()
export class EmailService {
  public emailExamples = {
    registrationEmail(code: string) {
      return ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://1c68ff11ce4124.lhr.life/auth/registration-confirmation?code=${code}'>register</a>
              </p>`
    },
    passwordRecoveryEmail(code: string) {
      return `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='https://1c68ff11ce4124.lhr.life/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`
    }
  }

  constructor(
    protected emailRepository: EmailRepository,
    protected usersQueryRepository: UsersQueryRepository
  ){}

  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<Result<{ messageId: string } | null>> {

    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
          user: SETTINGS.EMAIL,
          pass: SETTINGS.EMAIL_PASS,
        },
      });

      let info = await transporter.sendMail({
        from: `"testingNodemailer" <${SETTINGS.EMAIL}>`,
        to: email,
        subject: "Confirmation link",
        html: template(code),
      });

      console.log('Message sent: %s', info.messageId)
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: {
          messageId: info.messageId,
        }
      } as Result<{ messageId: string }>
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        status: ResultStatus.InternalServerError,
        extensions: [
          { field: 'email', message: 'ServerError sending email' }
        ],
        data: null
      } as Result<null>
    }
  }

  async confirmEmail(
    code: string
  ): Promise<Result<any>> {
    console.log(code);

    const isUuid = new RegExp(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    ).test(code)
    const dateNow = Date.now()

    if (!code || typeof code !== 'string' || code.trim().length === 0 || !isUuid) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'code', message: 'Incorrect code' }
        ],
      }
    }

    const user = await this.emailRepository.findByConfirmationCode(code)

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'code', message: 'No user matching this code' }
        ],
      }
    }

    if (user.emailConfirmation.status !== 0) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'code', message: 'Already confirmed' }
        ],
      }
    }

    if (isBefore(parseISO(user.emailConfirmation.expirationDate), dateNow)) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'code', message: 'Code expired' }
        ],
      }
    }

    const result = await this.emailRepository.confirmEmail(code)
    
    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  }

  async resendConfirmation(
    email: string
  ): Promise<Result<any>> {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(email)
    // const dateNow = Date.now()
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'No user matching this email' }
        ],
      }
    }

    if (user.emailConfirmation.status !== 0) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'Already confirmed' }
        ],
      }
    }

    const newCode = await this.emailRepository.changeConfirmation(email)

    if (!newCode) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'email', message: 'Cant make new confirmation info' }
        ],
      }
    }
    console.log(newCode, 'newCode resendConfirmation changeConfirmation');

    const result = await this.sendEmail(email, newCode, this.emailExamples.registrationEmail)

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.InternalServerError,
        extensions: [
          { field: 'email', message: 'ServerError sending email' }
        ],
        data: null
      } as Result<null>
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null
    } as Result<null>
  }
}