import { Injectable } from '@nestjs/common';

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
}
