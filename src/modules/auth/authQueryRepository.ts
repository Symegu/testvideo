import bcrypt from "bcrypt"

export const authQueryRepository = {
  
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  }
}