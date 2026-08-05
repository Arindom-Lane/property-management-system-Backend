import { Controller, Post,Body, Get, Param } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordEntity } from './entities/landlord.entity';
import { LandlordDto } from './dto/landlord.dto';

@Controller('landlord')
export class LandlordController {
  constructor(private readonly landlordService: LandlordService) {}


  ///Authenticaation

  @Post('register')
     registerLandlord(@Body() landlordDto: LandlordDto): Promise<LandlordEntity> {
        return this.landlordService.registerLandlord(landlordDto);
    }

    @Post('login')
  loginLandLord(@Body('name') name: string,@Body('password_hash') password_hash: string,): Promise<{ message: string }> {
    return this.landlordService.loginLandlord(name, password_hash);
  }



    ///////////////Profile

    @Get('profile/:id')
     getLandlordProfilebyId(@Param('id') id: number): Promise<LandlordEntity | null> {
        return this.landlordService.getLandlordProfile(id);
    }


}
