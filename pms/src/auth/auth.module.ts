import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { StaffModule } from 'src/staff/staff.module';
import { JwtModule, } from '@nestjs/jwt';
import { jwtConstants } from './secret/jwt-secret';

@Module({
  imports: [StaffModule, JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100d' },
    })],
  providers: [AuthService],
  controllers: [AuthController],

})
export class AuthModule {}
