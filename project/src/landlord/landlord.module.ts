import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';
import { LandlordEntity } from './entities/landlord.entity';
import { PropertyEntity } from './entities/property.entity';
import {StaffModule} from "../staff/staff.module"
import { workOrder } from 'src/staff/entities/work-order.entity';
import { MailerModule } from 'node_modules/@nestjs-modules/mailer/dist/mailer.module';


@Module({
  imports: [TypeOrmModule.forFeature([LandlordEntity,PropertyEntity,workOrder]), StaffModule,MailerModule.forRoot({
  transport: {
  host: 'arko1920@gmail.com',
  port: 465,
  ignoreTLS: true,
  secure: true,
  auth: {
  user: 'your gmail account',
  pass: 'generated password'
  },
  }
  })],
  controllers: [LandlordController],
  providers: [LandlordService],
  exports: [LandlordService],
})
export class LandlordModule {}