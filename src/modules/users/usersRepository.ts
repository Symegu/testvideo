import { ObjectId } from "mongodb"
import { usersCollection } from "../../db/mongoDb"
import { UserModel } from "../../types/db-types/user-db"
import { UserInputModel } from "../../types/input-output-types/user-types"
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto"
import { addDays } from 'date-fns'
// import { Result, ResultStatus } from "../../types/input-output-types/output-errors-type"

export const usersRepository = {

  async createUser(
    user: UserInputModel,
    adminCreation?: boolean
  ): Promise<string> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newUser: UserModel = {
      _id: new ObjectId(),
      login: user.login,
      password: await this.hashPassword(user.password),
      email: user.email,
      createdAt: createdAtISO,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: addDays(dateNow, 1).toISOString(),
        status: adminCreation ? 1 : 0
      }
    }
    const res = await usersCollection.insertOne(newUser)
    
    return res.insertedId.toString()
    // if (!res.insertedId) {
    //   const result: Result = {
    //     status: ResultStatus.InternalServerError,
    //     errorMessage: 'failed to add user to database',
    //     extensions: [],
    //     data: null
    //   }
    //   return result
    // }

    // const result: Result<{ userId: string; confirmationCode: string }> = {
    //   status: ResultStatus.Success,
    //   extensions: [],
    //   data: {
    //     userId: res.insertedId.toString(),
    //     confirmationCode: newUser.emailConfirmation.confirmationCode.toString(),
    //   },
    // }
    // return result
  },

  async deleteUser(
    id: string
  ): Promise<boolean> {
    const _id = new ObjectId(id);
    const res = await usersCollection.deleteOne({ _id: _id })
    return res.deletedCount === 1
  },

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}