import { Injectable, ConflictException, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { AnnouncementEntity } from './entities/announcement.entity';
import { AdminEntity } from './entities/admin.entity';
import { CreateAnnouncementDto } from './dto/announcement.dto';
import { UpdateAnnouncementDto } from './dto/updateAnnouncement.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,

    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  // Create Announcement
  async createAnnouncement( adminId: number, createAnnouncementDto: CreateAnnouncementDto,) {

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) { throw new NotFoundException('Admin not found');
    }

    const existingAnnouncement = await this.announcementRepository.findOne({
      where: { title: createAnnouncementDto.title },
    });

    if (existingAnnouncement) { throw new ConflictException('Announcement already exists');
    }

    const newAnnouncement = this.announcementRepository.create({
      title: createAnnouncementDto.title,
      body: createAnnouncementDto.body,
      created_by: admin,
    });

    const savedAnnouncement = await this.announcementRepository.save(newAnnouncement);

    return { message: 'Announcement created successfully',
      announcement: {
        id: savedAnnouncement.id,
        title: savedAnnouncement.title,
        body: savedAnnouncement.body,
        created_at: savedAnnouncement.created_at,
      },
    };
  }

  // Get All Announcements
  async getAllAnnouncements() {
    const announcements = await this.announcementRepository.find({
        relations: { created_by: true, },
        order: { created_at: 'DESC' },
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      created_at: announcement.created_at,
      created_by: {
        id: announcement.created_by.id,
        name: announcement.created_by.name,
        email: announcement.created_by.email,
      },
    }));
  }

  // Search Announcements
  async searchAnnouncements(keyword: string) {
    const announcements = await this.announcementRepository.find({
      where: [
        { title: ILike(`%${keyword}%`) },
        { body: ILike(`%${keyword}%`) },
      ],
      relations: { created_by: true, },
      order: { created_at: 'DESC' },
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      created_at: announcement.created_at,
      created_by: {
        id: announcement.created_by.id,
        name: announcement.created_by.name,
        email: announcement.created_by.email,
      },
    }));
  }

  // Get Announcement By ID
  async getAnnouncement(id: number) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: {
        created_by: true,
      },
    });

    if (!announcement) { throw new NotFoundException('Announcement not found');
    }

    return {
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      created_at: announcement.created_at,
      created_by: {
        id: announcement.created_by.id,
        name: announcement.created_by.name,
        email: announcement.created_by.email,
      },
    };
  }

  // Update Announcement
  async updateAnnouncement( id: number, updateAnnouncementDto: UpdateAnnouncementDto,) {

    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) { throw new NotFoundException('Announcement not found');
    }

    if (updateAnnouncementDto.title) {
      const existingAnnouncement = await this.announcementRepository.findOne({
        where: {
          title: updateAnnouncementDto.title,
        },
      });

      if (existingAnnouncement && existingAnnouncement.id !== announcement.id) {
        throw new ConflictException( 'Announcement title already exists',);
      }
    }

    Object.assign(announcement, updateAnnouncementDto);

    const updatedAnnouncement = await this.announcementRepository.save(announcement);

    return {
      message: 'Announcement updated successfully',
      announcement: {
        id: updatedAnnouncement.id,
        title: updatedAnnouncement.title,
        body: updatedAnnouncement.body,
        created_at: updatedAnnouncement.created_at,
      },
    };
  }

  // Delete Announcement
  async deleteAnnouncement(id: number) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) { throw new NotFoundException('Announcement not found'); }

    await this.announcementRepository.remove(announcement);

    return { message: 'Announcement deleted successfully', };
  }
}
