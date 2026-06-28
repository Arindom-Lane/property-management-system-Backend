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
  Res,
  ValidationPipe,
} from "@nestjs/common";
import { StaffService } from "./staff.service";
import { staffDataDto } from "./staff.staffData.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { staffDataDto3 } from "./staff.staffData.dto3";
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

  @Post("task3")
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(pdf)$/i)) {
          cb(null, true);
        } else {
          cb(
            new MulterError(
              "LIMIT_UNEXPECTED_FILE",
              "Only pdf files are allowed",
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  task3(
    @UploadedFile() file: Express.Multer.File,
    @Body() staffData3: staffDataDto3,
  ): any {
    if (file) {
      staffData3.file = file.filename;
    }
    return {
      data: staffData3,
    };
  }
}
