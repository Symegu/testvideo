import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/mongoDb";
import { UserModel } from "../../types/db-types/user-db";


export const authRepository = {
  async findConfirmationInfo(
    id: string
  ) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const _id = new ObjectId(id)
    const user = await usersCollection.findOne({_id})

    if(!user) {
      return null
    }

    return {
      id: user._id.toString(),
      emailConfirmation: {
        status: user.emailConfirmation.status,
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: user.emailConfirmation.expirationDate
      }
    }
  },

  async findByConfirmationCode(
    code: string
  ): Promise<UserModel | null> {
    const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
    console.log('findByConfirmationCode user', user);
    
    if (!user) {
      return null
    }
    
    return user
  },
  
  async confirmEmail(
    code: string,
  ) {
    const res = await usersCollection.updateOne({'emailConfirmation.confirmationCode': code}, {$set: {'emailConfirmation.status': 1}})
    console.log(res);
    
    return res.matchedCount === 1
  }
}