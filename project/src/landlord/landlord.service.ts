import { Injectable } from '@nestjs/common';
import { LandlordDto as landlordDto } from './landlord.dto';

@Injectable()
export class LandlordService {
    
  getLandlord(): string {
    return 'All Landlord';
  }

  getAllLandlord(): object {
    return { app: 'abc', id: '12' };
  }

  getLandlordByID(id: number, name: string): object {
    return { name: name, id: id };
  }

  getLandlordByIDandName(id: number, name: string): object {
    return { name: name, id: id };
  }

  createLandlord(landlordDto: landlordDto): string {
    return landlordDto.email + " " + landlordDto.pass + " " + landlordDto.gender + " " + landlordDto.phone;
  }
}
