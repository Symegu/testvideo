import { ObjectId } from "mongodb"
import { usersCollection } from "../../db/mongoDb"
import { UserModel } from "../../db/user-db"
import { UserInputModel } from "../../input-output-types/user-types"
import bcrypt from 'bcrypt';

export const usersRepository = {

  async createUser(
    user: UserInputModel
  ): Promise<string> {
    const dateNow = Date.now()
    const createdAtISO = new Date(dateNow).toISOString()
    const newUser: UserModel = {
      _id: new ObjectId(),
      login: user.login,
      password: await this.hashPassword(user.password),
      email: user.email,
      createdAt: createdAtISO
    }
    const res = await usersCollection.insertOne(newUser)
    return res.insertedId.toString()
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
  },
}