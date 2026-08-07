import {
  Body,Get,Param,ParseIntPipe,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { LandlordService } from './landlord.service';
import { LandlordDto } from './dto/landlord.dto';

@Controller('landlord')
export class LandlordController {

  constructor(
    private readonly landlordService: LandlordService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(
    @Body() dto: LandlordDto,
  ) {
    return this.landlordService.register(dto);
  }
  @Get(':id/tenants')
getTenantsByLandlord(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.landlordService.getTenantsByLandlord(id);
}
}