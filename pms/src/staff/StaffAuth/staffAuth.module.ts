import { Module } from '@nestjs/common';
import {staffAuthService } from './staffAuth.service';
import {staffAuthController } from './staffAuth.controller';
import { StaffModule } from 'src/staff/staff.module';
import { JwtModule, } from '@nestjs/jwt';
import { jwtConstants } from './secret/jwt-secret';

@Module({
  imports: [StaffModule, JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100d' },
    })],
  providers: [staffAuthService],
  controllers: [staffAuthController],

})
export class StaffAuthModule  {}
