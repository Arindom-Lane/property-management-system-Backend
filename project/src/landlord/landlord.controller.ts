import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { CreateLandlordDto } from './landlord.dto';


@Controller('landlord')
export class LandlordController {
  constructor(private readonly LandlordService: LandlordService) {}


////log in and register a landlord


  @Post('register')
  @UsePipes(new ValidationPipe())
   createLandlord(@Body() dto: CreateLandlordDto) {
    return this.LandlordService.createLandlord(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginLandlord(@Body() loginData: CreateLandlordDto) {
    return this.LandlordService.loginLandlord(loginData);
  }

  @Get('profile/:id')
  async profile(@Param('id',ParseIntPipe) id: number) {
    return this.LandlordService.getLandlordById(id);
  }

  @Patch('update/:id')
  @UsePipes(new ValidationPipe())
  async updateLandlord(
    @Param('id',ParseIntPipe) id: number,
    @Body() updateData: CreateLandlordDto,
  ) {
    return this.LandlordService.updateLandlord(id, updateData);
  }


  ///// update single or 2 part . 1 ta profile arekta only pass [optional]

  @Delete('delete/:id')
  async deleteLandlord(@Param('id',ParseIntPipe) id: number) {
    return this.LandlordService.deleteLandlord(id);
  }



}