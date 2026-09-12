import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { BlockEntity } from './entities/block.entity';
import { BuildingEntity } from './entities/building.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { StaffEntity } from 'src/staff/entities/staff.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { jwtConstants } from 'src/auth/jwt-secret';
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { AnnouncementEntity } from './entities/announcement.entity';
import { ComplaintEntity } from './entities/complaint.entity';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import { ComplaintController } from './complaint.controller';
import { ComplaintService } from './complaint.service';



@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity,BlockEntity,BuildingEntity, LandlordEntity, TenantEntity, StaffEntity, PropertyEntity, AnnouncementEntity, ComplaintEntity,]), 
            JwtModule.register({secret: jwtConstants.secret, signOptions: {expiresIn: '1d',},}),],
  providers: [AdminService, BlockService, BuildingService, AnnouncementService, ComplaintService, JwtStrategy,],
  controllers: [AdminController,  BlockController, BuildingController, AnnouncementController, ComplaintController],
})
export class AdminModule {}
