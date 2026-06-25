import { Controller, Get, Param, Post, Query,Body } from '@nestjs/common';
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

  @Get()
  getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Get(':id')
  getStaffById(@Param('id') id: string): object {
    return this.staffService.getStaffById(id);
  }

  // @Post()
  // createUser(@Body() body: object): object {
  //   // return this.staffService.createUser(body);
  //   console.log('Received body:', body);
  //   return body;
  // }

  @Post(':id')
createUser(@Param('id') id:string, @Body('name') name: string) {
  return {
    username: name
  };
}


  
}