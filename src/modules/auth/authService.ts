import bcrypt from "bcrypt"
import { SETTINGS } from "../../settings"
import { UserViewModel } from "../../types/db-types/user-db"
import jwt from 'jsonwebtoken'
import { authRepository } from "./authRepository"
import nodemailer from "nodemailer"
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"
import { isBefore, parseISO } from 'date-fns'
import { usersQueryRepository } from "../users/usersQueryRepository"


export const emailExamples = {
  registrationEmail(code: string) {
    return ` <h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:<br>
                <a href='http://localhost:3005/registration-confirmation?code=${code}'>complete registration</a>
            </p>`
  },
  passwordRecoveryEmail(code: string) {
    return `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
          <a href=https://localhost:3005/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
  }
}


export const authService = {
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  },

  async generateToken(user: UserViewModel) {
    console.log(user, user.id, user.login, 'generateToken user');

    return jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET)
  },

  async findConfirmationInfo(id: string) {
    const user = await authRepository.findConfirmationInfo(id)
    if (!user) {
      return null
    }

    return user
  },

  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string
  ): Promise<Result<{ messageId: string } | null>> {
    let transporter = nodemailer.createTransport({
      host: "smtp.yandex.ru",
      port: 465,
      secure: true,
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });
    try {
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
          {field: 'email', message: 'ServerError sending email'}
        ],
        data: null
      } as Result<null>
    }
  },

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
          { field: 'confirmationCode', message: 'Incorrect code' }
        ],
      }
    }

    const user = await authRepository.findByConfirmationCode(code)
  
    if(!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'confirmationCode', message: 'No user matching this code' }
        ],
      }
    }

    if(user.emailConfirmation.status !== 0) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'confirmationCode', message: 'Already confirmed' }
        ],
      }
    }

    if(isBefore(parseISO(user.emailConfirmation.expirationDate), dateNow)) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'confirmationCode', message: 'Code expired' }
        ],
      }
    }

    const result = await authRepository.confirmEmail(code)
    console.log(await authRepository.findByConfirmationCode(code));
    console.log(result);
    

    return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    }
  },

  async resendConfirmation(
    email: string
  ): Promise<Result<any>> {
    const user = await usersQueryRepository.findUserByLoginOrEmail(email)
    const dateNow = Date.now()

    if(!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'confirmationCode', message: 'No user matching this email' }
        ],
      }
    }

    if(user.emailConfirmation.status !== 0) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'confirmationCode', message: 'Already confirmed' }
        ],
      }
    }

    if(isBefore(parseISO(user.emailConfirmation.expirationDate), dateNow)) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: 'Bad Request',
        data: null,
        extensions: [
          { field: 'confirmationCode', message: 'Code expired' }
        ],
      }
    }

    const result = await this.sendEmail(email, user.emailConfirmation.confirmationCode, emailExamples.registrationEmail)
    
    if(result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.InternalServerError,
        extensions: [
          {field: 'email', message: 'ServerError sending email'}
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