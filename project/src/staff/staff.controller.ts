import { Controller, Get, Param, Query } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('search')
  getStaffByQuery(
    @Query('id') id: string,

  ): object {
    return this.staffService.getStaffByQuery(id);
  }
  // 1. Get all staff
  // URL: http://localhost:3000/staff
  @Get()
  getAllStaff() {
    return this.staffService.getAllStaff();
  }

  // 2. Using ROUTE PARAMETERS (@Param)
  // URL: http://localhost:3000/staff/123
  @Get(':id')
  getStaffById(@Param('id') id: string): object {
    return this.staffService.getStaffById(id);
  }

  // 3. Using QUERY PARAMETERS (@Query)
  // URL: http://localhost:3000/staff/search?id=123&name=Alex
  
}