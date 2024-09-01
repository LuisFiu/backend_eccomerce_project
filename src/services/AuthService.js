import bcrypt from "bcrypt";

class AuthService {
  async hashPassword(password) {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
  }
  async validatePassword(password, userPassword) {
    return bcrypt.compare(password, userPassword);
  }
}

export const authService = new AuthService();
