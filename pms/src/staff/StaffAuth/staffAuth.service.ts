import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { StaffService } from 'src/staff/staff.service';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class staffAuthService {
  constructor(
    private readonly staffService: StaffService,
  private readonly jwtService: JwtService) {}

  async logIn(email: string, password: string) {
    const staff = await this.validateStaff(email, password);
    if (!staff) throw new UnauthorizedException('Not the user bako');

    const payload = {
      email: email,
      password: password
    }
     const access_Token = await this.jwtService.signAsync(payload);

    return {
      access_Token: access_Token,
      userID: staff.id,
      email: staff.email,
    };
  }

  async validateStaff(email: string, password: string) {
    const staff = await this.staffService.findStaffByEmail(email);

    if (staff) {
      const isPasswordValid = await bcrypt.compare(password, staff.password_hash);
      if (isPasswordValid) return staff;
    }
    return null;
  }
}
