import { Injectable, ConflictException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { BlockEntity } from './entities/block.entity';
import { AdminEntity } from './entities/admin.entity';
import { CreateBlockDto } from './dto/block.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,

    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  // Create Block
  async createBlock( adminId: number, createBlockDto: CreateBlockDto,) {
    
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) { throw new NotFoundException('Admin not found');
    }

    const existingBlock = await this.blockRepository.findOne({
      where: { name: createBlockDto.name },
    });

    if (existingBlock) { throw new ConflictException('Block already exists');
    }

    const newBlock = this.blockRepository.create({
      name: createBlockDto.name,
      address: createBlockDto.address,
      created_by: admin,
    });

    const savedBlock = await this.blockRepository.save(newBlock);

    return { message: 'Block created successfully',
      block: {
        id: savedBlock.id,
        name: savedBlock.name,
        address: savedBlock.address,
        created_at: savedBlock.created_at,
      },
    };
  }

  // Get All Blocks
  async getAllBlocks() { 
    const blocks = await this.blockRepository.find({ 
        relations: { created_by: true, },
    });

    return blocks.map((block) => ({
      id: block.id,
      name: block.name,
      address: block.address,
      created_at: block.created_at,
      created_by: {
        id: block.created_by.id,
        name: block.created_by.name,
        email: block.created_by.email,
      },
    }));
  }

  // Get Block By ID
  async getBlock(id: number) {
    const block = await this.blockRepository.findOne({
      where: { id },
      relations: {
        created_by: true,
      },
    });

    if (!block) { throw new NotFoundException('Block not found');
    }

    return {
      id: block.id,
      name: block.name,
      address: block.address,
      created_at: block.created_at,
      created_by: {
        id: block.created_by.id,
        name: block.created_by.name,
        email: block.created_by.email,
      },
    };
  }

  // Search Block
  async searchBlock(keyword: string) {
    const blocks = await this.blockRepository.find({
      where: [
        { name: ILike(`%${keyword}%`) },
        { address: ILike(`%${keyword}%`) },
      ],
      relations: { created_by: true, },
    });

    return blocks.map((block) => ({
      id: block.id,
      name: block.name,
      address: block.address,
      created_at: block.created_at,
      created_by: {
        id: block.created_by.id,
        name: block.created_by.name,
        email: block.created_by.email,
      },
    }));
  }

  // Update Block
  async updateBlock( id: number, updateBlockDto: UpdateBlockDto,) {
    
    const block = await this.blockRepository.findOne({
      where: { id },
    });

    if (!block) { throw new NotFoundException('Block not found');
    }

    if (updateBlockDto.name) {
      const existingBlock = await this.blockRepository.findOne({
        where: {
          name: updateBlockDto.name,
        },
      });

      if (existingBlock && existingBlock.id !== block.id) {
        throw new ConflictException( 'Block name already exists',);
      }
    }

    Object.assign(block, updateBlockDto);

    const updatedBlock = await this.blockRepository.save(block);

    return {
      message: 'Block updated successfully',
      block: {
        id: updatedBlock.id,
        name: updatedBlock.name,
        address: updatedBlock.address,
        created_at: updatedBlock.created_at,
      },
    };
  }

  // Delete Block
  async deleteBlock(id: number) {
    const block = await this.blockRepository.findOne({
      where: { id },
    });

    if (!block) { throw new NotFoundException('Block not found'); }

    await this.blockRepository.remove(block);

    return { message: 'Block deleted successfully', };
  }
}