import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { LandlordModule } from './landlord/landlord.module';

@Module({
  imports: [AdminModule, LandlordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
