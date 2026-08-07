import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {LandlordEntity} from '../entities/landlord.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,
  ){}
}