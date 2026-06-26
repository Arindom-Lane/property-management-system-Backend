import { Controller, Get, Param, Post, Query,Body } from '@nestjs/common';
import { StaffService } from './staff.service';
import { staffDataDto } from './staff.staffData.dto';
import {}

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


  //SIngle value form within a object
//   @Post(':id')
// createUser(@Param('id') id:string, @Body('name') name: string) {
//   return {
//     username: name
//   };
// }


    // @Post()
    // createUser(
    //   @Body('name') name: string,
    //   @Body('age') age: number,
    // ) {
    //   return {
    //     name,
    //     age,
    //   };
    // }

    @Post('register')
    register(@Body() body: object): object {
    return {
        message: 'User Registered',
        user: body,
       };
    }

    // @Post()
    // creatStaffViaDTO(@Body() staffData: object): any{
    //   console.log(staffData);}
    // }

    @Post(':id')
    creatStaffViaDTO(
      @Param('id') id:number, 
      @Body() staffData: staffDataDto): any{
       console.log(staffData.name);
       console.log(staffData.age);
       console.log(staffData.email);
       return staffData;
    }

    

















  }