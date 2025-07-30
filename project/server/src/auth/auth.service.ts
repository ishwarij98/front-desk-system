import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/user.entity'; // 👈 Import UserRole enum

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  // Signup new user
  async signup(name: string, email: string, password: string, role: UserRole) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Pass role to user service
    return this.userService.create(email, password, name, role);
  }

  // Login user
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Include role in the JWT payload
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { token: this.jwtService.sign(payload), role: user.role };

  }
}
