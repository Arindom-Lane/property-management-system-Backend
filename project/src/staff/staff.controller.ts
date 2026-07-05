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

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  

}
