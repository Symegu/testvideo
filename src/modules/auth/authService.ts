import bcrypt from "bcrypt"
import { SETTINGS } from "../../settings"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { authRepository } from "./authRepository"
import nodemailer from "nodemailer"
import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"
import { isBefore, parseISO } from 'date-fns'
import { usersQueryRepository } from "../users/usersQueryRepository"
import { tokenRepository } from "./tokenRepository"

interface JwtUserPayload extends JwtPayload {
  userId: string;
  userLogin: string;
}
export const emailExamples = {
  registrationEmail(code: string) {
    return ` <h1>Thank for your registration</h1>
             <p>To finish registration please follow the link below:<br>
                <a href='https://429b301d51cdfe.lhr.life/auth/registration-confirmation?code=${code}'>https://9e8a61a631fb74.lhr.life/auth/registration-confirmation?code=${code}</a>
            </p>`
  },
  passwordRecoveryEmail(code: string) {
    return `<h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
          <a href='https://40bdc384729b51.lhr.life/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
  }
}


export const authService = {
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  },

  async getInfoFromPayload(token: string) {
    // const secret = tokenType === 'acc' ? SETTINGS.JWT_SECRET : SETTINGS.JWT_REFRESH_SECRET
    const payload = jwt.decode(token) as JwtUserPayload
    const userId = payload.userId
    const userLogin = payload.userLogin
    console.log( payload, 'getInfoFromPayload payload')

    return {
      id: userId,
      login: userLogin
    }
  },

  async generateAccessToken(user: { id: string, login: string }) {

    return jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
  },

  async generateRefreshToken(user: { id: string, login: string }) {
    return jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: '20s' })
  },

  async createTokens(user: { id: string, login: string }) {
    const accessToken = await this.generateAccessToken(user)
    const refreshToken = await this.generateRefreshToken(user)
    const addedToken = await tokenRepository.addToken(refreshToken)
    if (!addedToken) {
      return null
    }
    return { accessToken: accessToken, refreshToken: refreshToken }
  },

  async refreshTokens(oldRefreshToken: string) {
    const user = await this.getInfoFromPayload(oldRefreshToken)
    console.log( user, 'refreshTokens user')
    await this.deleteRefreshToken(oldRefreshToken)
    const tokens = await this.createTokens(user)
    if(!tokens) {
      return null 
    }
    if (!tokens.accessToken || !tokens.refreshToken) {
      return null
    }
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }
  },

  async updateRefreshToken(oldToken: string, newToken: string) {
    const updatedToken = await tokenRepository.updateToken(oldToken, newToken)

    return updatedToken
  },

  async deleteRefreshToken(refreshToken: string) {
    const res = await tokenRepository.deleteToken(refreshToken)
    if (!res) {
      return null
    }

    return res
  },

  async findRefreshToken(refreshToken: string) {
    const res = await tokenRepository.findToken(refreshToken)
    if (!res) {
      return null
    }

    return res
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
          { field: 'code', message: 'Incorrect code' }
        ],
      }
    }

    const user = await authRepository.findByConfirmationCode(code)

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

    const result = await authRepository.confirmEmail(code)
    console.log(await authRepository.findByConfirmationCode(code), 'findByConfirmationCode confirmEmail');
    console.log(result, 'confirmEmail result');


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
    console.log(user, 'resendConfirmation user');

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

    const newCode = await authRepository.changeConfirmation(email)

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

    const result = await this.sendEmail(email, newCode, emailExamples.registrationEmail)

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
  },
}