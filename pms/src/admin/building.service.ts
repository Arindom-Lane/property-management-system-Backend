import { Injectable, ConflictException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BuildingEntity } from './entities/building.entity';
import { BlockEntity } from './entities/block.entity';
import { AdminEntity } from './entities/admin.entity';
import { CreateBuildingDto } from './dto/building.dto';
import { UpdateBuildingDto } from './dto/updateBuilding.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(BuildingEntity)
    private readonly buildingRepository: Repository<BuildingEntity>,

    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,

    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  // Create Building
  async createBuilding( adminId: number,createBuildingDto: CreateBuildingDto, ) {
    
    const admin = await this.adminRepository.findOne({
    
        where: {id: adminId,},
    });

    if (!admin) {throw new NotFoundException('Admin not found');
    }

    const block = await this.blockRepository.findOne({
  
        where: { id: createBuildingDto.blockId,},
    });

    if (!block) {throw new NotFoundException('Block not found');}

    const existingBuilding = await this.buildingRepository.findOne({
  
        where: { name: createBuildingDto.name, },
    });

    if (existingBuilding) {throw new ConflictException('Building already exists');}

    const newBuilding = this.buildingRepository.create({
        name: createBuildingDto.name,
        block_id: block,
        created_by: admin,
    });

    const savedBuilding = await this.buildingRepository.save(newBuilding);

    return {
            message: 'Building created successfully',
            building: {
            id: savedBuilding.id,
            name: savedBuilding.name,
            created_at: savedBuilding.created_at,
        },
    };
  }

  // Get All Buildings
  async getAllBuildings() {

    const buildings = await this.buildingRepository.find({ relations: { block_id: true, created_by: true, },
  });

  return buildings.map((building) => ({
    id: building.id,
    name: building.name,
    created_at: building.created_at,
    block: {
      id: building.block_id.id,
      name: building.block_id.name,
    },
    created_by: {
      id: building.created_by.id,
      name: building.created_by.name,
      email: building.created_by.email,
    },
  }));
}

  // Get Building By ID
  async getBuilding(id: number) {

  const building = await this.buildingRepository.findOne({
    
    where: { id }, relations: { block_id: true, created_by: true, },
  });

  if (!building) { throw new NotFoundException('Building not found');
  }

  return {
    id: building.id,
    name: building.name,
    created_at: building.created_at,
    block: {
      id: building.block_id.id,
      name: building.block_id.name,
    },
    created_by: {
      id: building.created_by.id,
      name: building.created_by.name,
      email: building.created_by.email,
    },
  };
}

  // Search Building
  async searchBuilding(keyword: string) {

  const buildings = await this.buildingRepository.find({
    
    where: [{name: ILike(`%${keyword}%`),},],relations: {block_id: true,created_by: true,},
  });

  return buildings.map((building) => ({
    id: building.id,
    name: building.name,
    created_at: building.created_at,
    block: {
      id: building.block_id.id,
      name: building.block_id.name,
    },
    created_by: {
      id: building.created_by.id,
      name: building.created_by.name,
    },
  }));
}

  // Update Building
  async updateBuilding( id: number, updateBuildingDto: UpdateBuildingDto, ) {

  const building = await this.buildingRepository.findOne({
    
    where: { id }, relations: { block_id: true, },
  });

  if (!building) { throw new NotFoundException('Building not found');
  }

  if (updateBuildingDto.name) {
    const existingBuilding = await this.buildingRepository.findOne({
      
        where: { name: updateBuildingDto.name, },
    });

    if (existingBuilding && existingBuilding.id !== building.id) {
      throw new ConflictException('Building already exists');
    }
  }

  if (updateBuildingDto.blockId) {
    const block = await this.blockRepository.findOne({
      
        where: { id: updateBuildingDto.blockId, },
    });

    if (!block) { throw new NotFoundException('Block not found');
    }

    building.block_id = block;
  }

  Object.assign(building, { name: updateBuildingDto.name ?? building.name,
  });

  const updatedBuilding = await this.buildingRepository.save(building);

  return {
    message: 'Building updated successfully',
    building: updatedBuilding,
  };
}

  // Delete Building
  async deleteBuilding(id: number) {

  const building = await this.buildingRepository.findOne({
    
    where: { id },
  });

  if (!building) { throw new NotFoundException('Building not found');
  }

  await this.buildingRepository.remove(building);

  return { message: 'Building deleted successfully', };
}


}