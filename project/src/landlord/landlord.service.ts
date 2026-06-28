import { Injectable } from '@nestjs/common';
import { LandlordDto as landlordDto, landlordDto1, LandlordDto3, LandlordDto4 } from './landlord.dto';

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
  
  createLandlord3(landlorddto :LandlordDto3):string{
    return landlorddto.name + " " + landlorddto.pass + " " + landlorddto.phone + " " + landlorddto.file;
  }

  createLandlord4(landlorddto :LandlordDto4):string{
    return landlorddto.name + " " + landlorddto.pass + " " + landlorddto.date + " " + landlorddto.link ;
  }

  createLandlord1(landlorddto : landlordDto1):string{
    return landlorddto.name + " " + landlorddto.email + " " + landlorddto.nid + " " + landlorddto.nidimg ;
  }
}
