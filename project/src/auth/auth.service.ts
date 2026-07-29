import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { JwtService } from "@nestjs/jwt";

import * as bcrypt from "bcrypt";

import { StaffEntity } from "../staff/entities/staff.entity";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StaffEntity)
    private readonly staffRepo: Repository<StaffEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const staff = await this.staffRepo.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!staff) {
      throw new UnauthorizedException(
        "Invalid email or password",
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      dto.password,
      staff.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        "Invalid email or password",
      );
    }

    const payload = {
      id: staff.id,
      email: staff.email,
    };

    return {
      message: "Login Successful",

      access_token: this.jwtService.sign(payload),
    };
  }
}