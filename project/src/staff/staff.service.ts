import { Inject, Injectable } from '@nestjs/common';
import { staffData } from './staffData.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(staffData) private staffRepository: Repository<staffData>){}

}