import { Controller,Get,Param,Post,Query, UsePipes, ValidationPipe ,Body,Res,
  UseInterceptors, 
  UploadedFile,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { LandlordService } from './landlord.service';
import { LandlordDto, landlordDto1, LandlordDto3, LandlordDto4 } from './landlord.dto';

@Controller('landlord')
export class LandlordController {
    constructor(private readonly landlordService: LandlordService) {}

  @Get()
  getLandlord(): string {
    return this.landlordService.getLandlord();
  }

  @Get('getall')
  getAllLandlord(): object {
    return this.landlordService.getAllLandlord();
  }

  @Get('getlandlordbyid/:myid/getbyname')
  getLandlordByID(@Param('myid') id: number, @Param('name') name: string): object {
    return this.landlordService.getLandlordByID(id, name);
  }

  @Get('getlandlordbyidandname')
  getLandlordByIDandName(@Query('id') id: number, @Query('name') name: string): object {
    return this.landlordService.getLandlordByIDandName(id, name);
  }

  @UsePipes(new ValidationPipe())
  @Post('create2')
  createLandlord(@Body() landlordDto: LandlordDto): string {
    return this.landlordService.createLandlord(landlordDto);
  }

  @Post('create3')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(pdf)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'jpg|webp|png|jpeg|image'), false);
        }
      },
      limits: { fileSize: 300000 }, 
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )

@UsePipes( new ValidationPipe())
@Post('create3')
createLandlord3(@Body() landlordDto : LandlordDto3, @UploadedFile() file: Express.Multer.File): string {
    if (file) {
      landlordDto.file = file.filename;
    }
    return this.landlordService.createLandlord3(landlordDto);
}

@UsePipes( new ValidationPipe())
@Post('create4')
createLandlord4(@Body() landlordDto : LandlordDto4): string {
    return this.landlordService.createLandlord4(landlordDto);
}


@Get('/getimage/:name')
  getImages(@Param('name') name: string, @Res() res) {
    res.sendFile(name, { root: './uploads' });
  }



  @Post('create1')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('nid_file', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 2000}, 
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )

@UsePipes( new ValidationPipe())
@Post('create3')
createLandlord1(@Body() landlordDto : landlordDto1, @UploadedFile() file: Express.Multer.File): string {
    if (file) {
      landlordDto.nidimg = file.filename;
    }
    return this.landlordService.createLandlord3(landlordDto);
}


}
