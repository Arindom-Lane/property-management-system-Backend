import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { LandlordEntity } from './landlord.entity';
import { CreateLandlordDto } from './landlord.dto';
@Injectable()
export class LandlordService {
  constructor(
    @InjectRepository(LandlordEntity)
    private landlordRepository: Repository<LandlordEntity>,
  ) {}
  

  //////////login and register a landlord



  async createLandlord(dto: CreateLandlordDto): Promise<LandlordEntity> {
    const landlord = this.landlordRepository.create(dto);
    return this.landlordRepository.save(landlord);

  }

  async loginLandlord(loginData: CreateLandlordDto): Promise<LandlordEntity | null> {
    const { email, password } = loginData;
    const landlord = await this.landlordRepository.findOne({
      where: { email, password },
    });
    return landlord || null;
  }
  
  async getLandlordById(id: number): Promise<LandlordEntity | null> {
    const landlord = await this.landlordRepository.findOne({ where: { id } });
    return landlord || null;
  }

  async updateLandlord(id: number, updateData: CreateLandlordDto): Promise<LandlordEntity | null> {
    const landlord = await this.landlordRepository.findOne({ where: { id } });
    if (!landlord) {
      return null;
    }
    Object.assign(landlord, updateData);
    return this.landlordRepository.save(landlord);
  } 



  async deleteLandlord(id: number): Promise<void> {
  await this.landlordRepository.delete(id);
  }




  
  

  
}