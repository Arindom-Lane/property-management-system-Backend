import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { StaffEntity } from "../staff/entities/staff.entity";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffEntity]),

    JwtModule.register({
      secret: "PropertyManagementJWTSecret",
      signOptions: {
        expiresIn: "1h",
      },
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtAuthGuard],

  exports: [
    AuthService,
    JwtModule,
    JwtAuthGuard,
  ],
})
export class AuthModule { }