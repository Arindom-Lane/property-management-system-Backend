import { Controller,Get,Param,Query } from '@nestjs/common';
import { LandlordService } from './landlord.service';

@Controller('landlord')
export class LandlordController {
    constructor(private readonly landlordService: LandlordService) {}

  @Get()
  getLandlord(): string {
    return this.landlordService.getLandlord();
  }

  @Get('getall')
  getAllLandlord(): object {
    return this.landlordService.getAllLandlord();
  }

  @Get('getlandlordbyid/:myid')
  getLandlordByID(@Param('myid') id: number, @Query('name') name: string): object {
    return this.landlordService.getLandlordByID(id, name);
  }

  @Get('getlandlordbyidandname')
  getLandlordByIDandName(@Query('id') id: number, @Query('name') name: string): object {
    return this.landlordService.getLandlordByIDandName(id, name);
  }
}
