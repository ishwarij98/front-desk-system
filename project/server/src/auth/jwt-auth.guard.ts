// This guard is used to protect endpoints by requiring a valid JWT
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Extend the built-in Passport "jwt" strategy so we can use @UseGuards(JwtAuthGuard)
export class JwtAuthGuard extends AuthGuard('jwt') {}
