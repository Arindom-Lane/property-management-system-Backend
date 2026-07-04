import { Inject, Injectable } from '@nestjs/common';
import { staffData } from './staffData.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(staffData) private staffRepository: Repository<staffData>){}

  async createStaff(staffData: staffData): Promise<staffData> {
    return this.staffRepository.save(staffData);
  }

  async getAllStaffData(): Promise<staffData[]> {
    return this.staffRepository.find();
  }
  async getStaffById(id: number): Promise<staffData | null> {
    return this.staffRepository.findOneBy({ id: id });
  }

  async updateStaff( id: number, updateStaff: staffData): Promise<staffData | null> {
    await this.staffRepository.update(id, updateStaff);
    return this.staffRepository.findOneBy({ id: id });}

  async deleteStaff(id: number){
    await this.staffRepository.delete(id);
  }

    getAllStaff() {
    return 'This will return all staff members.';
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