import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { LandlordEntity } from './entities/landlord.entity';
import { LandlordDto } from './dto/landlord.dto';
import { PropertyEntity } from './entities/property.entity';
import { CreateWorkOrderDto } from '../staff/dto/create-work-oder.dto';
import { workOrder } from '../staff/entities/work-order.entity';
import * as bcrypt from 'bcrypt'; 
import { CreateReviewDto } from '../staff/dto/create-review.dto';
import { Review } from '../staff/entities/review.entity';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class LandlordService {
  constructor(
    @InjectRepository(LandlordEntity)
    private landlordRepository: Repository<LandlordEntity>,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(workOrder)
    private workOrderRepo: Repository<workOrder>,
    @InjectRepository(Review)
    private reviwRepo: Repository<Review>,
  ) {}

  //////////login and register a landlord




  async createLandlord(data: LandlordDto): Promise<LandlordEntity> {

    const IsLandlord = await this.landlordRepository.findOne({
      where: {email: data.email,
        phone_number: data.phone_number
      },
    })
    if(IsLandlord) {
      throw new ForbiddenException("Your account exists. YOu are not allowed");
    }

    const salt = 10;

    const hashedPassword = await bcrypt.hash(
      data.password,
      salt,
    );
    const newLandlord = this.landlordRepository.create({ ...data, password: hashedPassword });
    return this.landlordRepository.save(newLandlord);
  }
  
  async loginLandlord(loginData: LandlordDto): Promise<LandlordEntity | null> {
    const { email, password } = loginData;
    const landlord = await this.landlordRepository.findOne({
      where: { email },
    });
    if (landlord && await bcrypt.compare(password, landlord.password)) {
      return landlord;
    }
    return null;
  }
  
  async getLandlordById(id: number): Promise<LandlordEntity | null> {
    const landlord = await this.landlordRepository.findOne({ where: { id } });
    return landlord || null;
  }


  async updateLandlord(
    id: number,
    updateData: LandlordDto,
  ): Promise<LandlordEntity | null> {
    const landlord = await this.landlordRepository.findOne({ where: { id } });
    if (!landlord) {
      return null;
    }
    Object.assign(landlord, updateData);
    return await this.landlordRepository.save(landlord);
  }

  async deleteLandlord(id: number): Promise<void> {
    await await this.landlordRepository.delete(id);
  }

  async getPropertiesByLandlordId(
    landlordId: number,
  ): Promise<PropertyEntity[]> {
    return await this.propertyRepository.find({
      where: { landlord: { id: landlordId } },
    });
  }

  async createPropertyForLandlord(
    landlordId: number,
    propertyData: Partial<PropertyEntity>,
  ): Promise<PropertyEntity> {
    const landlord = await this.landlordRepository.findOne({
      where: { id: landlordId },
    });
    if (!landlord) {
      throw new Error("landlord not found");
    }
    const property = this.propertyRepository.create({
      ...propertyData,
      landlord,
    });
    return await this.propertyRepository.save(property);
  }

  async getLandlordWithProperties(
    landlordId: number,
  ): Promise<LandlordEntity | null> {
    return await this.landlordRepository.findOne({
      where: { id: landlordId },
      relations: {
        property: true,
      },
    });
  }

  async createWorkOrder(
    landlordId: number,
    dto: CreateWorkOrderDto,
  ): Promise<workOrder> {
    const landlord = await this.landlordRepository.findOne({
      where: { id: landlordId },
    });
    if (!landlord) {
      throw new NotFoundException("Landlord not found");
    }

    const workOrder = await this.workOrderRepo.create({ ...dto, landlord });
    return await this.workOrderRepo.save(workOrder);
  }

  async createReview(workOrderId: number, dto: CreateReviewDto) {
    // Find work order
    const order = await this.workOrderRepo.findOne({
      where: { id: workOrderId },
      relations: {
        review: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Work order not found");
    }

    // Prevent duplicate review
    if (order.review) {
      throw new BadRequestException("Review already exists");
    }
    // Create review
    const review = this.reviwRepo.create({
      ...dto,
      workOrder: order,
    });

    return await this.reviwRepo.save(review);
  }

  async createWorkOrderForProperty(
    propertyId: number,
    dto: CreateWorkOrderDto,
  ): Promise<workOrder> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundException("Property not found for the given landlord");
    }

    const workOrder = await this.workOrderRepo.create({ ...dto, property });
    return this.workOrderRepo.save(workOrder);
  }
}
