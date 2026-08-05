import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LandlordDto } from './dto/landlord.dto';
import type { UpdateLandlordDto } from './dto/update_landlord.dto';
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


    //// update full profile

    async updateLandlordProfile(id: number, UpdateLandlordDto: UpdateLandlordDto): Promise<LandlordEntity| null> {

        const landlord = await this.landlordRepository.findOne({ where: { id } });

        if (!landlord) {
            throw new UnauthorizedException('Landlord not found');
        }

        await this.landlordRepository.update( { id, }, { ... UpdateLandlordDto });    
        return this.landlordRepository.findOne({ where: { id:id } });
       }


       //////// update only password

    async updateLandlordPassword(id: number, password_hash: string,newpassword:string): Promise<LandlordEntity> {
        if (password_hash === newpassword) {
            throw new UnauthorizedException('New password cannot be the same as the current password');
        }

        const landlord = await this.landlordRepository.findOne({ where: { id } });

        if (!landlord) {
            throw new UnauthorizedException('Landlord not found');
        }

        if (landlord.password_hash !== password_hash) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        landlord.password_hash = newpassword;
        return this.landlordRepository.save(landlord);
    }


    //////  property

    getLandlordProperties(id: number): Promise<LandlordEntity | null> {
      const landlord = this.landlordRepository.findOne({
        where: { id: id },
        relations: { properties: true },
      });
      return landlord;
    }

    



}


