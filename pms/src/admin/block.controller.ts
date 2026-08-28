import { Body, Controller, Post, Get, Patch, Delete, Query, Param, ParseIntPipe, Request, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import { BlockService } from './block.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBlockDto } from './dto/block.dto';
import { UpdateBlockDto } from './dto/updateBlock.dto';

@Controller('admin/block')
@UseGuards(AuthGuard)
export class BlockController {
  constructor(
    private readonly blockService: BlockService,
  ) {}

    //admin/block/create (Create Block)
    @Post('create')
    @UsePipes(new ValidationPipe())
    createBlock( @Request() req, @Body() createBlockDto: CreateBlockDto, ) {
    
        return this.blockService.createBlock( req.user.id, createBlockDto, );
    }


    //admin/block/allblocks (Get All Blocks)
    @Get('allblocks')
    getAllBlocks() {
    
        return this.blockService.getAllBlocks();
    }


    //admin/block/search?keyword=abc (Search Block)
    @Get('search')
    searchBlock(
    @Query('keyword') keyword: string,) {
    
        return this.blockService.searchBlock(keyword);
    }


    //admin/block/id (Get Block By ID)
    @Get('find/:id')
    getBlock( @Param('id', ParseIntPipe) id: number, ) {
    
        return this.blockService.getBlock(id);
    }


    //admin/block/id (Update Block-PATCH)
    @Patch('update/:id')
    @UsePipes(new ValidationPipe())
    updateBlock( @Param('id', ParseIntPipe) id: number, @Body() updateBlockDto: UpdateBlockDto, ) {
    
        return this.blockService.updateBlock( id, updateBlockDto, );
    }


  //admin/block/id (Delete Block-DELETE)
    @Delete('delete/:id')
    deleteBlock( @Param('id', ParseIntPipe) id: number,) {
    
        return this.blockService.deleteBlock(id);
    }

    
}