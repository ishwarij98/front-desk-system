import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // forwardRef() fixes circular dependency between UserModule and AuthModule
    forwardRef(() => UserModule),

    // Register JWT globally with secret and expiry
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1d' }, // Token expires in 1 day
    }),
  ],
  // Add JwtStrategy so Nest knows about our JWT validation logic
  providers: [AuthService, JwtStrategy],
  // Export AuthService so it can be used in other modules like UserModule
  exports: [AuthService],
})
export class AuthModule {}
