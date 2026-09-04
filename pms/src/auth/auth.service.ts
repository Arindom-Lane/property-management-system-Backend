import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AdminEntity } from '../admin/entities/admin.entity';
import { StaffEntity, StaffStatus } from '../staff/entities/staff.entity';
import {
  LandlordEntity,
  LandlordStatus,
} from '../landlord/entities/landlord.entity';
import { TenantEntity, TenantStatus } from '../tenant/entities/tenant.entity';
import { AccountType, LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: number;
  email: string;
  accountType: AccountType;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,

    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,

    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,

    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    switch (dto.accountType) {
      case AccountType.ADMIN:
        return this.loginAdmin(email, dto.password);

      case AccountType.STAFF:
        return this.loginStaff(email, dto.password);

      case AccountType.LANDLORD:
        return this.loginLandlord(email, dto.password);

      case AccountType.TENANT:
        return this.loginTenant(email, dto.password);

      default:
        throw new UnauthorizedException('Invalid account type');
    }
  }

  private async loginAdmin(email: string, password: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.verifyPassword(password, admin.password_hash);

    return this.buildLoginResponse(
      admin.id,
      admin.name,
      admin.email,
      AccountType.ADMIN,
    );
  }

  private async loginStaff(email: string, password: string) {
    const staff = await this.staffRepository.findOne({ where: { email } });

    if (!staff) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (staff.status !== StaffStatus.ACTIVE) {
      throw new UnauthorizedException('Staff account is inactive');
    }

    await this.verifyPassword(password, staff.password_hash);

    return this.buildLoginResponse(
      staff.id,
      staff.name,
      staff.email,
      AccountType.STAFF,
    );
  }

  private async loginLandlord(email: string, password: string) {
    const landlord = await this.landlordRepository.findOne({
      where: { email },
    });

    if (!landlord) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (landlord.status !== LandlordStatus.active) {
      throw new UnauthorizedException('Landlord account is inactive');
    }

    await this.verifyPassword(password, landlord.password_hash);

    return this.buildLoginResponse(
      landlord.id,
      landlord.name,
      landlord.email,
      AccountType.LANDLORD,
    );
  }

  private async loginTenant(email: string, password: string) {
    const tenant = await this.tenantRepository.findOne({ where: { email } });

    if (!tenant) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (tenant.status !== TenantStatus.APPROVED) {
      throw new UnauthorizedException('Tenant account is not approved');
    }

    await this.verifyPassword(password, tenant.password_hash);

    return this.buildLoginResponse(
      tenant.id,
      tenant.name,
      tenant.email,
      AccountType.TENANT,
    );
  }

  private async verifyPassword(password: string, passwordHash: string) {
    const valid = await bcrypt.compare(password, passwordHash);

    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }

  private async buildLoginResponse(
    id: number,
    name: string,
    email: string,
    accountType: AccountType,
  ) {
    const payload: JwtPayload = {
      sub: id,
      email,
      accountType,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: accessToken,
      user: {
        id,
        name,
        email,
        account_type: accountType,
      },
    };
  }
}