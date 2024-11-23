import bcrypt from "bcrypt"
import { SETTINGS } from "../../settings";
import { UserViewModel } from "../../types/db-types/user-db";
import jwt from 'jsonwebtoken'

export const authQueryRepository = {
  
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  },

  async generateToken(user: UserViewModel) {
    console.log(user, user.id, user.login, 'generateToken user');
    
    return jwt.sign({ userId: user.id, userLogin: user.login }, SETTINGS.JWT_SECRET)
  },
}