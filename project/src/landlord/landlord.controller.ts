import { Controller,Get,Param,Post,Query, UsePipes, ValidationPipe ,Body} from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordDto } from './landlord.dto';

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

  @Get('getlandlordbyid/:myid/getbyname')
  getLandlordByID(@Param('myid') id: number, @Param('name') name: string): object {
    return this.landlordService.getLandlordByID(id, name);
  }

  @Get('getlandlordbyidandname')
  getLandlordByIDandName(@Query('id') id: number, @Query('name') name: string): object {
    return this.landlordService.getLandlordByIDandName(id, name);
  }

  @UsePipes(new ValidationPipe())
  @Post('createemail')
  createLandlord(@Body() landlordDto: LandlordDto): string {
    return this.landlordService.createLandlord(landlordDto);
  }
}
