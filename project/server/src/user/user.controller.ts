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

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // Signup endpoint: public
  @Post('signup')
  async signUp(@Body() body: { email: string; password: string; name: string }) {
    // Check if email is already taken
    const existing = await this.userService.findByEmail(body.email);
    if (existing) {
      throw new BadRequestException('Email already exists');
    }
    // Create new user and return it
    return this.userService.signUp(body.email, body.password, body.name);
  }

  // Login endpoint: public
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    // Return a JWT token if credentials are valid
    return this.authService.login(body.email, body.password);
  }

  // Protected profile endpoint: only accessible with valid token
  @UseGuards(JwtAuthGuard) // This applies the JWT guard
  @Get('profile')
  getProfile(@Req() req) {
    // req.user comes from jwt.strategy.ts validate() method
    return req.user;
  }
}
