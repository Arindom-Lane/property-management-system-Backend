import {Body, Post, Controller, UsePipes, ValidationPipe, Patch, UseGuards, Get, Request, Param, ParseIntPipe, Delete, Query, } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/admin.dto';
import { LoginAdminDto } from './dto/login.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { ChangePasswordDto } from './dto/ChangePass.dto';
import { CreateLandlordDto } from './dto/landlord.dto';
import { UpdateLandlordDto } from './dto/updateLandlord.dto';
import { CreateTenantDto } from './dto/Tenant.dto';
import { UpdateTenantDto } from './dto/updateTenant.dto';
import { CreateStaffDto } from './dto/Staff.dto';
import { UpdateStaffDto } from './dto/updateStaff.dto';
import { CreatePropertyDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/updateProperty.dto';


@Controller('admin')
export class AdminController {

    constructor(
        private readonly adminService:AdminService
    ){}

    //ADMIN MODULE...

    //admin/register (Admin Register)
    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() createAdminDto: CreateAdminDto){
        return this.adminService.register(createAdminDto)
    }

    //admin/login (Admin Login)
    // @Post('login')
    // @UsePipes(new ValidationPipe())
    // login(@Body() loginAdminDto:LoginAdminDto){
    //     return this.adminService.login(loginAdminDto);
    // }

    //admin/profile (Get Profile)
    @Get('profile')
    @UseGuards(AuthGuard)
    getProfile(@Request() req) {
        return this.adminService.getProfile(req.user);
    }

    //admin/profile(Update Profile)
    @Patch('profile')
    @UseGuards(AuthGuard)
    updateProfile(@Request() req,@Body() updateAdminDto: UpdateAdminDto,){
    
        return this.adminService.updateProfile(req.user.id,updateAdminDto,);
    }

    //admin/changepass (Update password)
    @Patch('changepass')
    @UseGuards(AuthGuard)
    changePassword(@Request() req,@Body() changePasswordDto: ChangePasswordDto,){
        
        return this.adminService.changePassword(req.user.id,changePasswordDto,);
    }

    //admin/ (Get All Admins)
    @Get()
    @UseGuards(AuthGuard)
    getAllAdmins() {
        return this.adminService.getAllAdmins();
    }

    //admin/search (search admin)
    @Get('search')
    @UseGuards(AuthGuard)
    searchAdmin(
    @Query('keyword') keyword: string,) {
        return this.adminService.searchAdmin(keyword);
    }

    //admin/id (Get admin by Id)
    @Get(':id')
    @UseGuards(AuthGuard)
    getAdminById(@Param('id', ParseIntPipe) id: number,) {
     return this.adminService.getAdminById(id);
    }

    //admin/id (Delete an admin)
    @Delete(':id')
    @UseGuards(AuthGuard)
    deleteAdmin(@Param('id', ParseIntPipe) id: number,) {
        return this.adminService.deleteAdmin(id);
    }




    //LANDLORD MODULE...

    @Post('landlord/create')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    createLandlord(@Request() req,@Body() createLandlordDto: CreateLandlordDto,) {
        
        return this.adminService.createLandlord(req.user.id,createLandlordDto,);
    }

    @Get('landlord/alllandlord')
    @UseGuards(AuthGuard)
    getAllLandlords() {
        return this.adminService.getAllLandlords();
    }

    @Get('landlord/find/:id')
    @UseGuards(AuthGuard)
    getLandlord(@Param('id', ParseIntPipe) id: number,) {
    
        return this.adminService.getLandlord(id);
    }

    @Get('landlord/search')
    @UseGuards(AuthGuard)
    searchLandlord(@Query('keyword') keyword: string,) {
    
        return this.adminService.searchLandlord(keyword);
    }

    @Patch('landlord/update/:id')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    updateLandlord(@Param('id', ParseIntPipe) id: number,@Body() updateLandlordDto: UpdateLandlordDto,) {
        
        return this.adminService.updateLandlord(id,updateLandlordDto,);
    }

    @Delete('landlord/delete/:id')
    @UseGuards(AuthGuard)
    deleteLandlord(@Param('id', ParseIntPipe) id: number,) {
    
        return this.adminService.deleteLandlord(id);
    }




    //TENANT MODULE...

    @Post('tenant/create')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    createTenant(@Body() createTenantDto: CreateTenantDto,) {
    
        return this.adminService.createTenant(createTenantDto,);
    }

    @Get('tenant/alltenants')
    @UseGuards(AuthGuard)
    getAllTenants() {
    return this.adminService.getAllTenants();
    }

    @Get('tenant/find/:id')
    @UseGuards(AuthGuard)
    getTenant(@Param('id', ParseIntPipe) id: number,) {
        return this.adminService.getTenant(id);
    }

    @Get('tenant/search')
    @UseGuards(AuthGuard)
    searchTenant(@Query('keyword') keyword: string,) {
    
        return this.adminService.searchTenant(keyword);
    }

    @Patch('tenant/update/:id')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())updateTenant(@Param('id', ParseIntPipe) id: number,@Body() updateTenantDto: UpdateTenantDto,) {
    
        return this.adminService.updateTenant(id,updateTenantDto,);
    }

    @Delete('tenant/delete/:id')
    @UseGuards(AuthGuard)
    deleteTenant(@Param('id', ParseIntPipe) id: number,) {
  
        return this.adminService.deleteTenant(id);
    }




    //STAFF MODULE...

    @Post('staff/create')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())createStaff(@Request() req,@Body() createStaffDto: CreateStaffDto,) {
        return this.adminService.createStaff(req.user.id,createStaffDto,);
    }

    @Get('staff/allstaff')
    @UseGuards(AuthGuard)
    getAllStaff() {
        return this.adminService.getAllStaff();
    }

    @Get('staff/find/:id')
    @UseGuards(AuthGuard)
    getStaff( @Param('id', ParseIntPipe) id: number,) {
        
        return this.adminService.getStaff(id);
    }

    @Get('staff/search')
    @UseGuards(AuthGuard)
    searchStaff(@Query('keyword') keyword: string, ) {
    
        return this.adminService.searchStaff(keyword);
    }

    @Patch('staff/update/:id')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    updateStaff( @Param('id', ParseIntPipe) id: number, @Body() updateStaffDto: UpdateStaffDto, ) {
    
        return this.adminService.updateStaff( id, updateStaffDto, );
    }

    @Delete('staff/delete/:id')
    @UseGuards(AuthGuard)
    deleteStaff( @Param('id', ParseIntPipe) id: number, ) {
    
        return this.adminService.deleteStaff(id);
    }





//PROPERTY MODULE...

    @Post('property/create')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    createProperty( @Request() req, @Body() createPropertyDto: CreatePropertyDto, ){
        
        return this.adminService.createProperty(req.user.id,createPropertyDto, );
    }

    @Get('property/allproperties')
    @UseGuards(AuthGuard)
    getAllProperties(){ 
        
        return this.adminService.getAllProperties();
    }

    @Get('property/find/:id')
    @UseGuards(AuthGuard)
    getProperty( @Param('id',ParseIntPipe) id:number, ){
    
        return this.adminService.getProperty(id);
    }

    @Get('property/search')
    @UseGuards(AuthGuard)
    searchProperty( @Query('keyword') keyword:string, ){
        
        return this.adminService.searchProperty(keyword);
    }

    @Patch('property/update/:id')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    updateProperty( @Param('id',ParseIntPipe) id:number, @Body() updatePropertyDto:UpdatePropertyDto, ){
    
        return this.adminService.updateProperty( id, updatePropertyDto, );
    }

    @Delete('property/delete/:id')
    @UseGuards(AuthGuard)
    deleteProperty( @Param('id',ParseIntPipe) id:number, ){
    
        return this.adminService.deleteProperty(id);
    }

    
    

    //ANNOUNCEMNET MODULE...

}
