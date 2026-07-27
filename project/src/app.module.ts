import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffController } from './staff/staff.controller';
import { StaffModule } from './staff/staff.module';
import { TypeOrmModule } from '@nestjs/typeorm'; //npm install --save @nestjs/typeorm typeorm pg
import { LandlordModule } from './landlord/landlord.module';



@Module({
  imports: [TypeOrmModule.forRoot({
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'postgres',
password: 'root', 
database: 'landlord',
autoLoadEntities: true,
synchronize: true,
}), StaffModule, LandlordModule],
  controllers: [AppController, StaffController],
  providers: [AppService],

})
export class AppModule {}
