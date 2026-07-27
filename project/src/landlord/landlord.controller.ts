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
import { LandlordDto } from './dto/landlord.dto';
import { PropertyEntity } from './entities/property.entity';
import { CreateWorkOrderDto } from '../staff/dto/create-work-oder.dto';


@Controller('landlord')
export class LandlordController {
  constructor(private readonly LandlordService: LandlordService) {}


////log in and register a landlord


  @Post('register')
  @UsePipes(new ValidationPipe())
   createLandlord(@Body() dto: LandlordDto) {
    return this.LandlordService.createLandlord(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginLandlord(@Body() loginData: LandlordDto) {
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
    @Body() updateData: LandlordDto,
  ) {
    return this.LandlordService.updateLandlord(id, updateData);
  }


  ///// update single or 2 part . 1 ta profile arekta only pass [optional]

  @Delete('delete/:id')
  async deleteLandlord(@Param('id',ParseIntPipe) id: number) {
    return this.LandlordService.deleteLandlord(id);
  }

  @Get(':landlordId/properties')
  async getPropertiesByLandlordId(@Param('landlordId', ParseIntPipe) landlordId: number) {
    return this.LandlordService.getPropertiesByLandlordId(landlordId);
  }

  @Post(':landlordId/properties')
  async createPropertyForLandlord(
    @Param('landlordId', ParseIntPipe) landlordId: number,
    @Body() propertyData: Partial<PropertyEntity>,
  ) {
    return this.LandlordService.createPropertyForLandlord(landlordId, propertyData);
  }

  @Get('/:landlordId')
  async getLandlordWithProperties(@Param('landlordId', ParseIntPipe) landlordId: number) {
    return this.LandlordService.getLandlordWithProperties(landlordId);
  }




   @Post('work_orders')
     createWorkOrder(@Body() dto: CreateWorkOrderDto) {
       return this.LandlordService.createWorkOrder(dto);
     }

}