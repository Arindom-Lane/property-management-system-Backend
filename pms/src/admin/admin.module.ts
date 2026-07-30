import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { BlockEntity } from './entities/block.entity';
import { BuildingEntity } from './entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity,BlockEntity,BuildingEntity])],
  providers: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
