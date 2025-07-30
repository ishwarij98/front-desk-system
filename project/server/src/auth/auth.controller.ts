import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../user/user.entity'; // 👈 Import UserRole

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Signup route with role
  @Post('signup')
  async signup(@Body() body: any) {
    const { name, email, password, role } = body;

    // Default role to staff if not provided
    return this.authService.signup(name, email, password, role || UserRole.STAFF);
  }

  // Login route
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }
}
