import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { LandlordEntity } from './entities/landlord.entity';
import { LandlordDto } from './dto/landlord.dto';
import { PropertyEntity } from './entities/property.entity';
@Injectable()
export class LandlordService {
  constructor(
    @InjectRepository(LandlordEntity)
    private landlordRepository: Repository<LandlordEntity>,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
  ) {}
  

  //////////login and register a landlord




  async createLandlord(dto: LandlordDto): Promise<LandlordEntity> {
    const landlord = this.landlordRepository.create(dto);
    return this.landlordRepository.save(landlord);

  }

  async loginLandlord(loginData: LandlordDto): Promise<LandlordEntity | null> {
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

  async updateLandlord(id: number, updateData: LandlordDto): Promise<LandlordEntity | null> {
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




  async getPropertiesByLandlordId(landlordId: number): Promise<PropertyEntity[]> {
    return this.propertyRepository.find({ where: { landlord: { id: landlordId } } });
  }

  
  
  async createPropertyForLandlord(landlordId: number, propertyData: Partial<PropertyEntity>): Promise<PropertyEntity > {
    const landlord = await this.landlordRepository.findOne({ where: { id: landlordId } });
    if (!landlord) {
      throw new Error('landlord not found'); 
    }
    const property = this.propertyRepository.create({ ...propertyData, landlord });
    return this.propertyRepository.save(property);
  }

  async getLandlordWithProperties(
  landlordId: number,): Promise<LandlordEntity | null> {
  return this.landlordRepository.findOne({
    where: { id: landlordId },
    relations: {
      property: true,
    },
  });
}

}