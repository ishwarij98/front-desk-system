// Import necessary decorators and classes
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Mark this class as injectable so NestJS can manage it
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Call the parent constructor (Strategy) with config options
    super({
      // Tell Passport how to extract the JWT: from Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Don't allow expired tokens
      ignoreExpiration: false,

      // The secret key must be the same we used when signing the token in AuthService
      secretOrKey: 'SECRET_KEY',
    });
  }

  // This function runs automatically after token is validated
  // "payload" is the data we embedded while signing the token (userId, email)
  async validate(payload: any) {
    // Whatever we return here will be attached to req.user in controllers
    return { userId: payload.sub, email: payload.email };
  }
}
