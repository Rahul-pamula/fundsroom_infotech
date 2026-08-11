import { UserRepository } from '../repositories/user.repository.js';
import { AuthenticationError, ConflictError } from '../utils/errors.js';
import { signToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const userRepository = new UserRepository();

export class AuthService {
  async login(email: string, password: string, role: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AuthenticationError('Invalid credentials or role.');
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);

    if (!passwordMatches) {
      throw new AuthenticationError('Invalid credentials or role.');
    }

    if (role !== user.role) {
      throw new AuthenticationError('Invalid credentials or role.');
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    };
  }

  async signup(email: string, password: string, fullName: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictError('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create(normalizedEmail, passwordHash, fullName, 'SALES');

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
    };
  }
}
