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



@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  

}
