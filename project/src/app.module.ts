import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffController } from './staff/staff.controller';
import { StaffModule } from './staff/staff.module';
import { TypeOrmModule } from '@nestjs/typeorm'; //npm install --save @nestjs/typeorm typeorm pg



@Module({
  imports: [TypeOrmModule.forRoot({
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'postgres',
password: 'admin', // please keep the password: admin
// admin is the default passowrd, keep it as is
database: 'property_Management_system',
autoLoadEntities: true,
synchronize: true,
}), StaffModule,],
  controllers: [AppController, StaffController],
  providers: [AppService],

})
export class AppModule {}
