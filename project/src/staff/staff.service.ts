import { Inject, Injectable } from '@nestjs/common';
import { StaffData } from './staffData.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(StaffData) private staffRepository: Repository<StaffData>){}
    getAllStaff() {
    return 'This will return all staff members.';
  }

  getStaffById(id: string): object {
    return { id, name: 'John Doe', position: 'Manager' };
  }

  getStaffByQuery(id: string): object {
    return { id: id, name: 'Alex', position: 'Staff Manager (Found via Query)' };
  }

  createUser(body: object): object {
    return {
      message: 'User created successfully'
    }
  }






}