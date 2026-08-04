import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { StaffService } from 'src/staff/staff.service';
import { authLoginDTO } from './dto/authLogin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly staffService: StaffService) {}

  async logIn(email: string, password: string) {
    const staff = await this.validateStaff(email, password);
    if (!staff) throw new UnauthorizedException('Not the user bako');

    return {
      access_Token: 'Fake_token',
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
