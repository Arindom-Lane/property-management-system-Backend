import { Body, Controller, Post, Get, Patch, Delete, Query, Param, ParseIntPipe, Request, UseGuards, UsePipes, ValidationPipe, } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { CreateAnnouncementDto } from './dto/announcement.dto';
import { UpdateAnnouncementDto } from './dto/updateAnnouncement.dto';

@Controller('admin/announcement')
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
  constructor(
    private readonly announcementService: AnnouncementService,
  ) {}

    //admin/announcement/create (Create Announcement)
    @Post('create')
    @UsePipes(new ValidationPipe())
    createAnnouncement( @Request() req, @Body() createAnnouncementDto: CreateAnnouncementDto, ) {

        return this.announcementService.createAnnouncement( req.user.id, createAnnouncementDto, );
    }


    //admin/announcement/allannouncements (Get All Announcements)
    @Get('allannouncements')
    getAllAnnouncements() {

        return this.announcementService.getAllAnnouncements();
    }


    //admin/announcement/search?keyword=abc (Search Announcement)
    @Get('search')
    searchAnnouncements(
    @Query('keyword') keyword: string,) {

        return this.announcementService.searchAnnouncements(keyword);
    }


    //admin/announcement/find/:id (Get Announcement By ID)
    @Get('find/:id')
    getAnnouncement( @Param('id', ParseIntPipe) id: number, ) {

        return this.announcementService.getAnnouncement(id);
    }


    //admin/announcement/update/:id (Update Announcement-PATCH)
    @Patch('update/:id')
    @UsePipes(new ValidationPipe())
    updateAnnouncement( @Param('id', ParseIntPipe) id: number, @Body() updateAnnouncementDto: UpdateAnnouncementDto, ) {

        return this.announcementService.updateAnnouncement( id, updateAnnouncementDto, );
    }


    //admin/announcement/delete/:id (Delete Announcement-DELETE)
    @Delete('delete/:id')
    deleteAnnouncement( @Param('id', ParseIntPipe) id: number,) {

        return this.announcementService.deleteAnnouncement(id);
    }


}
