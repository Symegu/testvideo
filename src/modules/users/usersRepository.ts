import { UserInputModel } from "../../types/input-output-types/user-types"
import bcrypt from 'bcrypt'
import { randomUUID } from "crypto"
import { addDays } from 'date-fns'
import { UserModelClass } from "../../db/mongoDb"
import { injectable } from "inversify"

@injectable()
export class UsersRepository {

  async createUser(
    user: UserInputModel,
    adminCreation?: boolean
  ): Promise<string> {
    try {
      const dateNow = Date.now()
      const createdAtISO = new Date(dateNow).toISOString()
      const password = await this.hashPassword(user.password)
      const newUser = new UserModelClass({
        login: user.login,
        password: password,
        email: user.email,
        createdAt: createdAtISO,
        emailConfirmation: {
          confirmationCode: randomUUID(),
          expirationDate: addDays(dateNow, 1).toISOString(),
          status: adminCreation ? 1 : 0
        }
      })
      const savedUser = await newUser.save()
      return savedUser.id.toString()
    } catch (error) {
      console.error('Error in createUser repository:', error)
      throw new Error('Failed to create user')
    }
  }

  async deleteUser(
    id: string
  ): Promise<boolean> {
    try {
      const res = await UserModelClass.deleteOne({ _id: id })
      return res.deletedCount === 1
    } catch (error) {
      console.error('Error in deleteUser repository:', error)
      throw new Error('Failed to delete user')
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(password, salt)
      return hashedPassword
    } catch (error) {
      console.error('Error in hashPassword repository:', error)
      throw new Error('Failed to hash password')
    }
  }

  async changeUserPassword(
    id: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const password = await this.hashPassword(newPassword)
      const res = await UserModelClass.updateOne({ _id: id }, { $set: { password: password } })
      return res.matchedCount === 1
    } catch (error) {
      console.error('Error in changeUserPassword repository:', error)
      throw new Error('Failed to change password')
    }
  }
}


// import { UserInputModel } from "../../types/input-output-types/user-types"
// import bcrypt from 'bcrypt'
// import { randomUUID } from "crypto"
// import { addDays } from 'date-fns'
// import { UserModelClass } from "../../db/mongoDb"
// import { injectable } from "inversify"

// @injectable()
// export class UsersRepository {

//   async createUser(
//     user: UserInputModel,
//     adminCreation?: boolean
//   ): Promise<string> {
//     const dateNow = Date.now()
//     const createdAtISO = new Date(dateNow).toISOString()
//     const password = await this.hashPassword(user.password)
//     const newUser = new UserModelClass({
//       login: user.login,
//       password: password,
//       email: user.email,
//       createdAt: createdAtISO,
//       emailConfirmation: {
//         confirmationCode: randomUUID(),
//         expirationDate: addDays(dateNow, 1).toISOString(),
//         status: adminCreation ? 1 : 0
//       }
//     })
//     const savedUser = await newUser.save()
//     return savedUser.id.toString()
//   }

//   async deleteUser(
//     id: string
//   ): Promise<boolean> {
//     const res = await UserModelClass.deleteOne({ _id: id })
//     return res.deletedCount === 1
//   }

//   async hashPassword(password: string): Promise<string> {
//     const saltRounds = 10
//     const salt = await bcrypt.genSalt(saltRounds)
//     const hashedPassword = await bcrypt.hash(password, salt)
//     return hashedPassword
//   }

//   async changeUserPassword(
//     id: string,
//     newPassword: string
//   ): Promise<boolean> {
//     const password = await this.hashPassword(newPassword)
//     const res = await UserModelClass.updateOne({ _id: id }, { $set: { password: password } })
//     return res.matchedCount === 1
//   }
// } 