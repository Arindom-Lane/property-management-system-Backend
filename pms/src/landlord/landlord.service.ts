import {
  BadRequestException,
  Injectable,NotFoundException,
} from '@nestjs/common';
// import {
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { LandlordEntity } from './entities/landlord.entity';
import { LandlordDto } from './dto/landlord.dto';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';
@Injectable()   
export class LandlordService {

  constructor(

    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,

    @InjectRepository(TenantEntity)
  private readonly tenantRepository: Repository<TenantEntity>,
  ) {}

  async register(
    dto: LandlordDto,
  ): Promise<any> {

    const existingLandlord =
      await this.landlordRepository.findOne({
        where: [
          { email: dto.email },
          { phone: dto.phone },
        ],
      });

    if (existingLandlord) {
      throw new BadRequestException(
        'Landlord already exists.',
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    const landlord =
      this.landlordRepository.create({

        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password_hash: hashedPassword,

      });

    const saved =
      await this.landlordRepository.save(
        landlord,
      );

    return {

      message:
        'Landlord registered successfully.',

      email: saved.email,

      phone: saved.phone,

    };
  }
  async getTenantsByLandlord(
  landlordId: number,
): Promise<TenantEntity[]> {

  const landlord = await this.landlordRepository.findOne({
    where: {
      id: landlordId,
    },
  });

  if (!landlord) {
    throw new NotFoundException(
      'Landlord not found.',
    );
  }

  return await this.tenantRepository.find({
    where: {
      property: {
        landlord: {
          id: landlordId,
        },
      },
    },
    relations: {
      property: true,
    },
  });
}
}