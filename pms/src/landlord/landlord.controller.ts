import { Controller, Post,Body, Get, Param, Put, Patch } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordEntity } from './entities/landlord.entity';
import { LandlordDto } from './dto/landlord.dto';
import type { UpdateLandlordDto } from './dto/update_landlord.dto';

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

    //////// update full profile

    @Put('update/:id')
    updateLandlordProfile(@Param('id') id: number, @Body() UpdateLandlordDto: UpdateLandlordDto): Promise<LandlordEntity | null> {
        return this.landlordService.updateLandlordProfile(id, UpdateLandlordDto);
    }

    //////// update only password

    @Patch('update_password/:id')
    updateLandlordPassword(@Param('id') id: number,@Body('name') name: string,@Body('password_hash') password_hash: string,@Body('newpassword') newpassword:string): Promise<LandlordEntity> {
        return this.landlordService.updateLandlordPassword(id,password_hash,newpassword);
    }


    //////  proterty  

    @Get('properties/:id')
    getLandlordProperties(@Param('id') id: number): Promise<LandlordEntity | null> {
        return this.landlordService.getLandlordProperties(id);
    }

    

}
