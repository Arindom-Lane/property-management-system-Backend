import { Body, Controller, Post, Get, Patch, Delete, Query, Param, ParseIntPipe, Request, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import { BuildingService } from './building.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { CreateBuildingDto } from './dto/building.dto';
import { UpdateBuildingDto } from './dto/updateBuilding.dto';

@Controller('admin/building')
@UseGuards(JwtAuthGuard)
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
  ) {}


    //admin/building/create (Create Building)
    @Post('create')
    @UsePipes(new ValidationPipe())
    createBuilding( @Request() req, @Body() createBuildingDto: CreateBuildingDto, ) {
    
        return this.buildingService.createBuilding( req.user.id, createBuildingDto, );
    }


    //admin/building/allbuildings (Get All Buildings)
    @Get('allbuildings')
    getAllBuildings() {
    
        return this.buildingService.getAllBuildings();
    }


    //admin/building/search?keyword=abc (Search Building)
    @Get('search')
    searchBuilding( @Query('keyword') keyword: string, ) {
    
        return this.buildingService.searchBuilding(keyword);
    }


    //admin/building/find/:id (Get Building By ID)
    @Get('find/:id')
    getBuilding( @Param('id', ParseIntPipe) id: number, ) {
    
        return this.buildingService.getBuilding(id);
    }


    //admin/building/update/:id (Update Building-PATCH)
    @Patch('update/:id')
    @UsePipes(new ValidationPipe())
    updateBuilding( @Param('id', ParseIntPipe) id: number, @Body() updateBuildingDto: UpdateBuildingDto, ) {
    
        return this.buildingService.updateBuilding( id, updateBuildingDto,);
    }


    //admin/building/delete/:id (Delete Building-DELETE)
    @Delete('delete/:id')
    deleteBuilding( @Param('id', ParseIntPipe) id: number, ) {
    
        return this.buildingService.deleteBuilding(id);
    }
}