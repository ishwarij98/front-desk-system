import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from './user.entity';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // ✅ Signup endpoint (public)
  @Post('signup')
  async signUp(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: UserRole; // Optional role
    },
  ) {
    // Check if email is already taken
    const existing = await this.userService.findByEmail(body.email);
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Create user (defaults to STAFF if no role provided)
    return this.userService.create(
      body.email,
      body.password,
      body.name,
      body.role || UserRole.STAFF,
    );
  }

  // ✅ Login endpoint (public)
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // ✅ Profile endpoint (protected)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user; // Comes from jwt.strategy.ts validate()
  }
}
