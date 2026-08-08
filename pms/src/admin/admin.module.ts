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
import { BlockController } from './block.controller';
import { BlockService } from './block.service';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';



@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity,BlockEntity,BuildingEntity, LandlordEntity, TenantEntity, StaffEntity, PropertyEntity,]), 
            JwtModule.register({secret: 'mySecretKey', signOptions: {expiresIn: '1d',},}),],
  providers: [AdminService, BlockService, BuildingService, JwtStrategy,],
  controllers: [AdminController,  BlockController, BuildingController],
})
export class AdminModule {}
