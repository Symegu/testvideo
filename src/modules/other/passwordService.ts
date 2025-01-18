import bcrypt from 'bcrypt'

export const passwordService = {
  async validatePassword(providedPassword: string, password: string) {
    const match = await bcrypt.compare(providedPassword, password);
    return match
  },
}