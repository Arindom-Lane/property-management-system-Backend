import { Body, Controller, Post, Get, Patch, Delete, Query, Param, ParseIntPipe, Request, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { CreateComplaintDto } from './dto/complaint.dto';
import { UpdateComplaintStatusDto } from './dto/updateComplaint.dto';
import { ComplaintStatus } from './entities/complaint.entity';

@Controller('admin/complaint')
export class ComplaintController {
  constructor(
    private readonly complaintService: ComplaintService,
  ) {}

    //admin/complaint/submit (File a Complaint - open to LANDLORD/TENANT/STAFF, no admin login needed)
    @Post('submit')
    @UsePipes(new ValidationPipe())
    submitComplaint( @Body() createComplaintDto: CreateComplaintDto, ) {

        return this.complaintService.createComplaint(createComplaintDto);
    }


    //admin/complaint/allcomplaints (Get All Complaints)
    @UseGuards(JwtAuthGuard)
    @Get('allcomplaints')
    getAllComplaints() {

        return this.complaintService.getAllComplaints();
    }


    //admin/complaint/search?keyword=abc (Search Complaints)
    @UseGuards(JwtAuthGuard)
    @Get('search')
    searchComplaints(
    @Query('keyword') keyword: string,) {

        return this.complaintService.searchComplaints(keyword);
    }


    //admin/complaint/status?status=PENDING (Get Complaints by status)
    @UseGuards(JwtAuthGuard)
    @Get('status')
    getComplaintsByStatus(
    @Query('status') status: ComplaintStatus,) {

        return this.complaintService.getComplaintsByStatus(status);
    }


    //admin/complaint/filer?filed_by_type=TENANT (Get Complaints by filer type)
    @UseGuards(JwtAuthGuard)
    @Get('filer')
    getComplaintsByFiler(
    @Query('filed_by_type') filedByType: string,) {

        return this.complaintService.getComplaintsByFiler(filedByType);
    }


    //admin/complaint/find/:id (Get Complaint By ID)
    @UseGuards(JwtAuthGuard)
    @Get('find/:id')
    getComplaint( @Param('id', ParseIntPipe) id: number, ) {

        return this.complaintService.getComplaint(id);
    }


    //admin/complaint/update/:id (Admin inspect / update status-PATCH)
    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    @UsePipes(new ValidationPipe())
    updateComplaintStatus( @Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateComplaintStatusDto: UpdateComplaintStatusDto, ) {

        return this.complaintService.updateComplaintStatus( id, req.user.id, updateComplaintStatusDto, );
    }


    //admin/complaint/delete/:id (Delete Complaint-DELETE)
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    deleteComplaint( @Param('id', ParseIntPipe) id: number,) {

        return this.complaintService.deleteComplaint(id);
    }


}
