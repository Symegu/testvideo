import { UserModel } from "../../types/db-types/user-db"
import { randomUUID } from "crypto"
import { addDays } from 'date-fns'
import { injectable } from "inversify"
import { UserModelClass } from "../../db/mongoDb"

@injectable()
export class EmailRepository {

  async findConfirmationInfo(
    id: string
  ) {
    const user = await UserModelClass.findOne({ id })

    if (!user) {
      return null
    }

    return {
      id: user.id.toString(),
      emailConfirmation: {
        status: user.emailConfirmation.status,
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: user.emailConfirmation.expirationDate
      }
    }
  }

  async findByConfirmationCode(
    code: string
  ): Promise<UserModel | null> {
    const user = await UserModelClass.findOne({ 'emailConfirmation.confirmationCode': code })
    console.log('findByConfirmationCode user', user);

    if (!user) {
      return null
    }

    return user
  }

  async confirmEmail(
    code: string,
  ) {
    const res = await UserModelClass.updateOne({ 'emailConfirmation.confirmationCode': code }, { $set: { 'emailConfirmation.status': 1 } })
    console.log(res);

    return res.matchedCount === 1
  }

  async changeConfirmation(
    email: string
  ) {
    const dateNow = Date.now()
    const newConfirmInfo = {

      status: 0,
      confirmationCode: randomUUID(),
      expirationDate: addDays(dateNow, 1).toISOString()

    }
    const res = await UserModelClass.updateOne({ email: email }, { $set: { emailConfirmation: newConfirmInfo } })

    if (res.matchedCount === 1) {
      return newConfirmInfo.confirmationCode
    }

    return null
  }
}