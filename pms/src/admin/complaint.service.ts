import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplaintEntity, ComplaintStatus, ComplaintAgainstType } from './entities/complaint.entity';
import { AdminEntity } from './entities/admin.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import { StaffEntity } from 'src/staff/entities/staff.entity';
import { CreateComplaintDto, FiledByType } from './dto/complaint.dto';
import { UpdateComplaintStatusDto } from './dto/updateComplaint.dto';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectRepository(ComplaintEntity)
    private readonly complaintRepository: Repository<ComplaintEntity>,

    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,

    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,

    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,

    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,
  ) {}

  // validate the filer actually exists (landlord / tenant / staff)
  private async validateFiler(filedByType: FiledByType, filedById: number) {
    let exists = false;

    switch (filedByType) {
      case FiledByType.LANDLORD:
        exists = !!(await this.landlordRepository.findOne({ where: { id: filedById } }));
        break;
      case FiledByType.TENANT:
        exists = !!(await this.tenantRepository.findOne({ where: { id: filedById } }));
        break;
      case FiledByType.STAFF:
        exists = !!(await this.staffRepository.findOne({ where: { id: filedById } }));
        break;
    }

    if (!exists) {
      throw new NotFoundException(`${filedByType} not found`);
    }
  }

  // validate the complaint target actually exists
  private async validateTarget(againstType: ComplaintAgainstType, againstId: number | undefined) {
    if (againstId === undefined || againstId === null) {
      return; // generic complaint, no specific person
    }

    let exists = false;

    switch (againstType) {
      case ComplaintAgainstType.LANDLORD:
        exists = !!(await this.landlordRepository.findOne({ where: { id: againstId } }));
        break;
      case ComplaintAgainstType.TENANT:
        exists = !!(await this.tenantRepository.findOne({ where: { id: againstId } }));
        break;
      case ComplaintAgainstType.STAFF:
        exists = !!(await this.staffRepository.findOne({ where: { id: againstId } }));
        break;
    }

    if (!exists) {
      throw new NotFoundException(`${againstType} not found`);
    }
  }

  // Create Complaint (filed by landlord/tenant/staff)
  async createComplaint(createComplaintDto: CreateComplaintDto) {

    await this.validateFiler(createComplaintDto.filed_by_type, createComplaintDto.filed_by_id);

    await this.validateTarget(createComplaintDto.against_type, createComplaintDto.against_id);

    const newComplaint = this.complaintRepository.create({
      filed_by_type: createComplaintDto.filed_by_type,
      filed_by_id: createComplaintDto.filed_by_id,
      against_type: createComplaintDto.against_type,
      against_id: createComplaintDto.against_id, // may be undefined for generic complaints
      description: createComplaintDto.description,
    });

    const savedComplaint = await this.complaintRepository.save(newComplaint);

    return { message: 'Complaint submitted successfully',
      complaint: {
        id: savedComplaint.id,
        filed_by_type: savedComplaint.filed_by_type,
        filed_by_id: savedComplaint.filed_by_id,
        against_type: savedComplaint.against_type,
        against_id: savedComplaint.against_id,
        description: savedComplaint.description,
        status: savedComplaint.status,
        created_at: savedComplaint.created_at,
      },
    };
  }

  // Get All Complaints (Admin)
  async getAllComplaints() {
    const complaints = await this.complaintRepository.find({
        order: { created_at: 'DESC' },
    });

    return complaints;
  }

  // Search Complaints (Admin)
  async searchComplaints(keyword: string) {
    const complaints = await this.complaintRepository
      .createQueryBuilder('complaint')
      .where('complaint.description ILIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('complaint.filed_by_type ILIKE :keyword', { keyword: `%${keyword}%` })
      .orderBy('complaint.created_at', 'DESC')
      .getMany();

    return complaints;
  }

  // Get Complaints by status (Admin)
  async getComplaintsByStatus(status: ComplaintStatus) {
    const complaints = await this.complaintRepository.find({
        where: { status },
        order: { created_at: 'DESC' },
    });

    return complaints;
  }

  // Get Complaints by filer (Admin) e.g. all complaints from tenants
  async getComplaintsByFiler(filedByType: string) {
    const complaints = await this.complaintRepository.find({
        where: { filed_by_type: filedByType },
        order: { created_at: 'DESC' },
    });

    return complaints;
  }

  // Get Complaint By ID (Admin)
  async getComplaint(id: number) {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
    });

    if (!complaint) { throw new NotFoundException('Complaint not found');
    }

    return complaint;
  }

  // Update Complaint Status / Inspection (Admin)
  async updateComplaintStatus( id: number, reviewedByAdminId: number, updateComplaintStatusDto: UpdateComplaintStatusDto,) {

    const complaint = await this.complaintRepository.findOne({
      where: { id },
    });

    if (!complaint) { throw new NotFoundException('Complaint not found');
    }

    const admin = await this.adminRepository.findOne({
      where: { id: reviewedByAdminId },
    });

    if (!admin) { throw new NotFoundException('Admin not found');
    }

    complaint.status = updateComplaintStatusDto.status;

    if (updateComplaintStatusDto.admin_note !== undefined) {
      complaint.admin_note = updateComplaintStatusDto.admin_note;
    }

    complaint.reviewed_by = admin;

    const updatedComplaint = await this.complaintRepository.save(complaint);

    return {
      message: 'Complaint updated successfully',
      complaint: {
        id: updatedComplaint.id,
        status: updatedComplaint.status,
        admin_note: updatedComplaint.admin_note,
        reviewed_by: {
          id: updatedComplaint.reviewed_by.id,
          name: updatedComplaint.reviewed_by.name,
        },
      },
    };
  }

  // Delete Complaint (Admin)
  async deleteComplaint(id: number) {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
    });

    if (!complaint) { throw new NotFoundException('Complaint not found'); }

    await this.complaintRepository.remove(complaint);

    return { message: 'Complaint deleted successfully', };
  }
}
