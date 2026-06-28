import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Body,
  UsePipes,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { StaffService } from "./staff.service";
import { staffDataDto } from "./staff.staffData.dto";
import { ValidationPipe } from "@nestjs/common";
import { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express/multer/interceptors/file.interceptor";
import { staffDataDto2 } from "./staff.staffData.dto2";
import { staffDataDto4 } from "./staff.staffData.dto4";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get("search")
  getStaffByQuery(@Query("id") id: string): object {
    return this.staffService.getStaffByQuery(id);
  }

  @Get()
  getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Get(":id")
  getStaffById(@Param("id") id: string): object {
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

  @Post("register")
  @UseInterceptors(FileInterceptor("file"))
  register(@Body() body: object): object {
    return {
      message: "User Registered",
      user: body,
    };
  }

  // @Post()
  // creatStaffViaDTO(@Body() staffData: object): any{
  //   console.log(staffData);}
  // }

  // @UsePipes(ValidationPipe)
  // @Post(':id')
  // creatStaffViaDTO(
  //   @Param('id') id:number,
  //   @Body() staffData: staffDataDto): any{
  //   //  console.log(staffData.name);
  //   //  console.log(staffData.age);
  //   //  console.log(staffData.email);
  //    return staffData;
  // }

  @UsePipes(ValidationPipe)
  @Post(":id")
  @UseInterceptors(FileInterceptor("file"))
  userCategory(@Param("id") id: number, @Body() staffData: staffDataDto): any {
    return staffData;
    /* \
      {
  "email": "arindom@gmail.aiub.edu",
  "password":"ab234cabC",
  "gender": "male",
  "phone": "19876543211"
}
  */
  }

  @UsePipes(ValidationPipe)
  @Post("task3")
  task2(
    @Param("task4") task4: number,

    @Body() staffData2: staffDataDto2,
  ): any {
    return staffData2;
  }

  @UsePipes(ValidationPipe)
  @Post("task4")
  task3(@Param("task4") task4: number, @Body() staffData4: staffDataDto4): any {
    return staffData4;
  }
}
