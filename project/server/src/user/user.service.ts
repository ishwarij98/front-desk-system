import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity'; // 👈 Import UserRole enum

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  /**
   * Create a new user (used during signup)
   * @param email - user's email
   * @param password - plain password
   * @param name - user's name
   * @param role - optional user role (defaults to staff)
   */
  async create(
    email: string,
    password: string,
    name: string,
    role: UserRole = UserRole.STAFF // 👈 Default to STAFF if not provided
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👇 Include role in the user object
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    return this.userRepo.save(user);
  }

  // Find user by email
  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}
