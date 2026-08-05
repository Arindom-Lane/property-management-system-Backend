import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LandlordDto } from './dto/landlord.dto';
import { LandlordEntity } from './entities/landlord.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';

@Injectable()
export class LandlordService {
constructor(
    @InjectRepository(LandlordEntity)
    private landlordRepository: Repository<LandlordEntity>,
  ) {}



  /////////Authentication

  registerLandlord(landlordDto: LandlordDto): Promise<LandlordEntity> {
    const landlord = this.landlordRepository.create(landlordDto);
    return this.landlordRepository.save(landlord);
  }

  async loginLandlord(name: string, password_hash: string): Promise<{ message: string }> {
    const landlord = await this.landlordRepository.findOne({
      where: {
        name: name,
        password_hash: password_hash,
      },
    });

    if (!landlord) {
      throw new UnauthorizedException('Invalid name or password');
    }

    return { message: 'Login successful' };
  }


  //////////Profile

    getLandlordProfile(id: number): Promise<LandlordEntity | null> {
        return this.landlordRepository.findOne({
            where: { id: id },
        });
    }



}
