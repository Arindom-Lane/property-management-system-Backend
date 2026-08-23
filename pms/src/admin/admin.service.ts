import {Injectable,ConflictException,NotFoundException,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';
//import { BlockEntity } from './entities/block.entity';
import { BuildingEntity } from './entities/building.entity';
import { StaffEntity } from 'src/staff/entities/staff.entity';
import { CreateAdminDto } from './dto/admin.dto';
import { LoginAdminDto } from './dto/login.dto';
import { UpdateAdminDto } from './dto/updateAdmin.dto';
import { ChangePasswordDto } from './dto/ChangePass.dto';
import { ILike } from 'typeorm';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';
import { CreateLandlordDto } from './dto/landlord.dto';
import { UpdateLandlordDto } from './dto/updateLandlord.dto';
import { TenantEntity } from 'src/tenant/entities/tenant.entity';
import { CreateTenantDto } from './dto/Tenant.dto';
import { UpdateTenantDto } from './dto/updateTenant.dto';
import { CreateStaffDto } from './dto/Staff.dto';
import { UpdateStaffDto } from './dto/updateStaff.dto';
import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { CreatePropertyDto } from './dto/property.dto';
import { UpdatePropertyDto } from './dto/updateProperty.dto';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,

    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,

    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,

    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,

    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,

    //@InjectRepository(BlockEntity)
    //private readonly blockRepository: Repository<BlockEntity>,

    @InjectRepository(BuildingEntity)
    private readonly buildingRepository: Repository<BuildingEntity>,

    private readonly jwtService: JwtService,
  ) {}


  //ADMIN MODULE...

  // Register
  async register(createAdminDto: CreateAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
      where: {email: createAdminDto.email,},
    });

    if (existingAdmin) { throw new ConflictException('Email already exists');}

    const hashedPassword = await bcrypt.hash(createAdminDto.password,10,);

    const newAdmin = this.adminRepository.create({
      name: createAdminDto.name,
      email: createAdminDto.email,
      password_hash: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(newAdmin);

    return {
      message: 'Admin registered successfully',
      admin: {
        id: savedAdmin.id,
        name: savedAdmin.name,
        email: savedAdmin.email,
        created_at: savedAdmin.created_at,
      },
    };
  }

  // Login
  async login(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: {email: loginAdminDto.email,},
    });

    if (!admin) {throw new UnauthorizedException('Invalid email or password',);
    }

    const isPasswordMatched = await bcrypt.compare(loginAdminDto.password,admin.password_hash,);

    if (!isPasswordMatched) {throw new UnauthorizedException('Invalid email or password',);
    }

    const payload = {sub: admin.id,email: admin.email,};

    const accessToken = await this.jwtService.signAsync(payload);

    return {message: 'Login successful', access_token: accessToken,
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
      },
    };
  }

  // Profile
  async getProfile(user: any) {
    const admin = await this.adminRepository.findOne({
      where: {id: user.id,},
    });

    if (!admin) {throw new NotFoundException('Admin not found');}

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      created_at: admin.created_at,
    };
  }

  // Update Profile
  async updateProfile(adminId: number,updateAdminDto: UpdateAdminDto,) {
    
    const admin = await this.adminRepository.findOne({
      where: {id: adminId,},
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (updateAdminDto.email) {
      const existingAdmin =
        await this.adminRepository.findOne({
          where: {
            email: updateAdminDto.email,
          },
        });

      if (
        existingAdmin &&
        existingAdmin.id !== admin.id
      ) {
        throw new ConflictException(
          'Email already exists',
        );
      }
    }

    Object.assign(admin, updateAdminDto);

    const updatedAdmin =
      await this.adminRepository.save(admin);

    return {
      message: 'Profile updated successfully',
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        created_at: updatedAdmin.created_at,
      },
    };
  }

  // Change Password
  async changePassword(
    adminId: number,
    changePasswordDto: ChangePasswordDto,
  ) {
    const admin = await this.adminRepository.findOne({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const isPasswordMatched = await bcrypt.compare(
      changePasswordDto.oldPassword,
      admin.password_hash,
    );

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Old password is incorrect',
      );
    }

    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    admin.password_hash = hashedPassword;

    await this.adminRepository.save(admin);

    return {
      message: 'Password changed successfully',
    };
  }

    // Get All Admins
    async getAllAdmins() {
    const admins = await this.adminRepository.find();
    return admins.map(admin => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        created_at: admin.created_at,
    }));

  }

    // Get Admin by ID
    async getAdminById(id: number) {

    const admin = await this.adminRepository.findOne({
        where: {id,},
    });

    if (!admin) {throw new NotFoundException('Admin not found');}

    return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        created_at: admin.created_at,
    };
    }

    // Delete Admin
    async deleteAdmin(id: number) {

    const admin = await this.adminRepository.findOne({
        where: {id,},
    });

    if (!admin) {throw new NotFoundException('Admin not found');}

    await this.adminRepository.remove(admin);

    return {message: 'Admin deleted successfully',};
    }

    // Search Admin
    async searchAdmin(keyword: string) {

    const admins = await this.adminRepository.find({
        where: [
            { name: ILike(`%${keyword}%`) },
            { email: ILike(`%${keyword}%`) },
        ],
    });

    return admins.map(admin => ({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        created_at: admin.created_at,
    }));
    }

//LANDLORD MODULE...

    async createLandlord(adminId: number,createLandlordDto: CreateLandlordDto,) {

    const admin = await this.adminRepository.findOne({
        where: { id: adminId },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

    const existingLandlord = await this.landlordRepository.findOne({
        where: { email: createLandlordDto.email,
    },
  });

  if (existingLandlord) { throw new ConflictException('Landlord already exists');
  }

  const hashedPassword = await bcrypt.hash( createLandlordDto.password, 10,
  );

  const landlord = this.landlordRepository.create({
    name: createLandlordDto.name,
    email: createLandlordDto.email,
    phone: createLandlordDto.phone,
    password_hash: hashedPassword,
    created_by: admin,
  });

  await this.landlordRepository.save(landlord);

  return {
    message: 'Landlord created successfully',
    landlord: {
      id: landlord.id,
      name: landlord.name,
      email: landlord.email,
      phone: landlord.phone,
      status: landlord.status,
      created_at: landlord.created_at,
            },
        };
    }

    async getAllLandlords() {
    
    const landlords = await this.landlordRepository.find({relations: {created_by: true,},});

        return landlords.map((landlord) => ({
            id: landlord.id,
            name: landlord.name,
            email: landlord.email,
            phone: landlord.phone,
            status: landlord.status,
            created_at: landlord.created_at,
            created_by: {
            id: landlord.created_by.id,
            name: landlord.created_by.name,
            email: landlord.created_by.email,
            },
        }));
    }

    async getLandlord(id: number) {

    const landlord = await this.landlordRepository.findOne({
    
        where: {id,},relations: {created_by: true,},
    });

  if (!landlord) {throw new NotFoundException('Landlord not found');}

    return {
        id: landlord.id,
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
        status: landlord.status,
        created_at: landlord.created_at,
        created_by: {
            id: landlord.created_by.id,
            name: landlord.created_by.name,
            email: landlord.created_by.email,
        },
        };
    }

    async searchLandlord(keyword: string) {

    const landlords = await this.landlordRepository.find({
        where: [
            {name: ILike(`%${keyword}%`),},
            {email: ILike(`%${keyword}%`),},
            {phone: ILike(`%${keyword}%`),},
        ],relations: {created_by: true,},
    });

    return landlords.map((landlord) => ({
        id: landlord.id,
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
        status: landlord.status,
        created_at: landlord.created_at,
        created_by: {
            id: landlord.created_by.id,
            name: landlord.created_by.name,
            email: landlord.created_by.email,
            },
        }));
    }

    async updateLandlord( id: number, updateLandlordDto: UpdateLandlordDto,) {

    const landlord = await this.landlordRepository.findOne({
    
        where: { id },
    });

    if (!landlord) { throw new NotFoundException('Landlord not found');
    }

    if (updateLandlordDto.email) {

    const existingLandlord = await this.landlordRepository.findOne({
        
        where: { email: updateLandlordDto.email,},
      });

    if ( existingLandlord && existingLandlord.id !== landlord.id) {
      
        throw new ConflictException('Email already exists',);
    }
  }

  Object.assign( landlord, updateLandlordDto, );

  const updatedLandlord = await this.landlordRepository.save( landlord,);

    return {
        message: 'Landlord updated successfully',
        landlord: updatedLandlord,
        };
    }

    async deleteLandlord(id: number) {

    const landlord = await this.landlordRepository.findOne({
      where: { id },});

    if (!landlord) {throw new NotFoundException('Landlord not found',);}

    await this.landlordRepository.remove(landlord,);

        return {message:'Landlord deleted successfully',};
    }

//TENANT MODULE...

    async createTenant(createTenantDto: CreateTenantDto,) {

    const existingTenant = await this.tenantRepository.findOne({
        where: {email: createTenantDto.email,},});

    if (existingTenant) {throw new ConflictException('Tenant already exists');}

    const hashedPassword = await bcrypt.hash( createTenantDto.password, 10,
    );

    const tenant = this.tenantRepository.create({
        name: createTenantDto.name,
        email: createTenantDto.email,
        phone: createTenantDto.phone,
        password_hash: hashedPassword,
        nid_number: createTenantDto.nid_number,
        nid_document_url: createTenantDto.nid_document_url,
        has_vehicle: createTenantDto.has_vehicle,
    });

    await this.tenantRepository.save(tenant);

    return {
        message: 'Tenant created successfully',
        tenant: {
            id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            phone: tenant.phone,
            nid_number: tenant.nid_number,
            has_vehicle: tenant.has_vehicle,
            status: tenant.status,
            created_at: tenant.created_at,
            },
        };
    }

    async getAllTenants() {

    const tenants = await this.tenantRepository.find({
        relations: { property: true, approved_by: true,},
    });

    return tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        nid_number: tenant.nid_number,
        has_vehicle: tenant.has_vehicle,
        status: tenant.status,
        created_at: tenant.created_at,

        property: tenant.property
            ? {
                  id: tenant.property.id,
                  unit_number: tenant.property.unit_number,
              }
            : null,

        approved_by: tenant.approved_by
            ? {
                  id: tenant.approved_by.id,
                  name: tenant.approved_by.name,
              }
            : null,
    }));
    }

    async getTenant(id: number) {

    const tenant = await this.tenantRepository.findOne({
        where: { id },
        relations: {
            property: true,
            approved_by: true,
        },
    });

    if (!tenant) {
        throw new NotFoundException('Tenant not found');
    }

    return tenant;
    }

    async searchTenant(keyword: string) {

    const tenants = await this.tenantRepository.find({
        where: [
            { name: ILike(`%${keyword}%`) },
            { email: ILike(`%${keyword}%`) },
            { phone: ILike(`%${keyword}%`) },
            { nid_number: ILike(`%${keyword}%`) },
        ],
    });

    return tenants;
    }

    async updateTenant(
  id: number,
  updateTenantDto: UpdateTenantDto,
) {

  const tenant = await this.tenantRepository.findOne({
    where: { id },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found');
  }

  if (updateTenantDto.email) {

    const existingTenant =
      await this.tenantRepository.findOne({
        where: {
          email: updateTenantDto.email,
        },
      });

    if (
      existingTenant &&
      existingTenant.id !== tenant.id
    ) {
      throw new ConflictException(
        'Email already exists',
      );
    }
  }

  Object.assign(
    tenant,
    updateTenantDto,
  );

  const updatedTenant =
    await this.tenantRepository.save(
      tenant,
    );

  return {
    message: 'Tenant updated successfully',
    tenant: {
      id: updatedTenant.id,
      name: updatedTenant.name,
      email: updatedTenant.email,
      phone: updatedTenant.phone,
      nid_number: updatedTenant.nid_number,
      nid_document_url:
        updatedTenant.nid_document_url,
      has_vehicle:
        updatedTenant.has_vehicle,
      status: updatedTenant.status,
      created_at: updatedTenant.created_at,
        },
    };
    }

    async deleteTenant(id: number) {

  const tenant =await this.tenantRepository.findOne({where: { id },});

  if (!tenant) {throw new NotFoundException('Tenant not found',);}

  await this.tenantRepository.remove(tenant,);

  return {message: 'Tenant deleted successfully',};
    }

    //Staff...

    async createStaff(adminId: number,createStaffDto: CreateStaffDto,) {
        
        const admin = await this.adminRepository.findOne({
        where: { id: adminId },});

    if (!admin) {throw new NotFoundException('Admin not found');}

    const existingStaff = await this.staffRepository.findOne({
        where: {email: createStaffDto.email,},
    });

    if (existingStaff) {throw new ConflictException('Staff already exists');}

    const hashedPassword = await bcrypt.hash(createStaffDto.password,10,);

    const staff = this.staffRepository.create({
    name: createStaffDto.name,
    email: createStaffDto.email,
    phone: createStaffDto.phone,
    password_hash: hashedPassword,
    created_by: admin,
    });

    await this.staffRepository.save(staff);

    return {
        message: 'Staff created successfully',
        staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        status: staff.status,
        created_at: staff.created_at,
        },
    };
    }

    async getAllStaff() {

  const staffs = await this.staffRepository.find({
    relations: {
      created_by: true,
    },
  });

  return staffs.map((staff) => ({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    status: staff.status,
    created_at: staff.created_at,
    created_by: staff.created_by
      ? {
          id: staff.created_by.id,
          name: staff.created_by.name,
          email: staff.created_by.email,
        }
      : null,
  }));
}

async getStaff(id: number) {

  const staff = await this.staffRepository.findOne({
    where: { id },
    relations: {
      created_by: true,
    },
  });

  if (!staff) {
    throw new NotFoundException('Staff not found');
  }

  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    status: staff.status,
    created_at: staff.created_at,
    created_by: staff.created_by
      ? {
          id: staff.created_by.id,
          name: staff.created_by.name,
          email: staff.created_by.email,
        }
      : null,
  };
}

async searchStaff(keyword: string) {

  const staffs = await this.staffRepository.find({
    where: [
      { name: ILike(`%${keyword}%`) },
      { email: ILike(`%${keyword}%`) },
      { phone: ILike(`%${keyword}%`) },
    ],
    relations: {
      created_by: true,
    },
  });

  return staffs.map((staff) => ({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    phone: staff.phone,
    status: staff.status,
    created_at: staff.created_at,
    created_by: staff.created_by
      ? {
          id: staff.created_by.id,
          name: staff.created_by.name,
          email: staff.created_by.email,
        }
      : null,
  }));
}

async updateStaff(
  id: number,
  updateStaffDto: UpdateStaffDto,
) {

  const staff = await this.staffRepository.findOne({
    where: { id },
  });

  if (!staff) {
    throw new NotFoundException('Staff not found');
  }

  if (updateStaffDto.email) {

    const existingStaff =
      await this.staffRepository.findOne({
        where: {
          email: updateStaffDto.email,
        },
      });

    if (
      existingStaff &&
      existingStaff.id !== staff.id
    ) {
      throw new ConflictException(
        'Email already exists',
      );
    }
  }

  Object.assign(staff, updateStaffDto);

  const updatedStaff =
    await this.staffRepository.save(staff);

  return {
    message: 'Staff updated successfully',
    staff: updatedStaff,
  };
}

async deleteStaff(id: number) {

  const staff = await this.staffRepository.findOne({
    where: { id },
  });

  if (!staff) {
    throw new NotFoundException('Staff not found');
  }

  await this.staffRepository.remove(staff);

  return {
    message: 'Staff deleted successfully',
  };
}


//Property...

async createProperty(
  adminId: number,
  createPropertyDto: CreatePropertyDto,
) {

  const admin = await this.adminRepository.findOne({
    where: { id: adminId },
  });

  if (!admin) {
    throw new NotFoundException('Admin not found');
  }

  const building = await this.buildingRepository.findOne({
    where: {
      id: createPropertyDto.buildingId,
    },
  });

  if (!building) {
    throw new NotFoundException('Building not found');
  }

  const landlord = await this.landlordRepository.findOne({
    where: {
      id: createPropertyDto.landlordId,
    },
  });

  if (!landlord) {
    throw new NotFoundException('Landlord not found');
  }

  const existingProperty =
    await this.propertyRepository.findOne({
      where: {
        unit_number: createPropertyDto.unit_number,
      },
    });

  if (existingProperty) {
    throw new ConflictException(
      'Property already exists',
    );
  }

  const property =
    this.propertyRepository.create({

      unit_number: createPropertyDto.unit_number,

      building: building,

      landlord: landlord,

      rent_amount: createPropertyDto.rent_amount,

      service_charge: createPropertyDto.service_charge,

      has_parking: createPropertyDto.has_parking,

      parking_fee: createPropertyDto.parking_fee,

      listing_status: createPropertyDto.listing_status,

      status: createPropertyDto.status,

      created_by: admin.name,
    });

  const savedProperty = await this.propertyRepository.save(property, );

  return {

    message:
      'Property created successfully',

    property: {

      id: savedProperty.id,

      unit_number: savedProperty.unit_number,

      building: {id: savedProperty.building?.id, name: savedProperty.building?.name,},

      landlord: savedProperty.landlord.name,

      rent_amount: savedProperty.rent_amount,

      service_charge: savedProperty.service_charge,

      has_parking: savedProperty.has_parking,

      parking_fee: savedProperty.parking_fee,

      listing_status: savedProperty.listing_status,

      status: savedProperty.status,

      created_by: savedProperty.created_by,

      created_at: savedProperty.created_at,
    },
  };
}

async getAllProperties() {

  const properties =
    await this.propertyRepository.find({

      relations: {
        building: true,
        landlord: true,
        tenant: true,
      },
    });

  return properties.map(property => ({

    id: property.id,

    unit_number: property.unit_number,

    building: {

      id: property.building?.id,
      name: property.building?.name,
    },

    landlord: {
      id: property.landlord.id,
      name: property.landlord.name,
    },
    tenant:
      property.tenant
      ? {
          id: property.tenant.id,
          name: property.tenant.name,
        }
      : null,

    rent_amount: property.rent_amount,

    service_charge: property.service_charge,

    has_parking: property.has_parking,

    parking_fee: property.parking_fee,

    listing_status: property.listing_status,

    status:property.status,

    created_by: property.created_by,

    created_at: property.created_at,

  }));

}

async getProperty(id: number) {

  const property =
    await this.propertyRepository.findOne({

      where: {
        id,
      },

      relations: {

        building: true,

        landlord: true,

        tenant: true,
      },
    });

  if (!property) {

    throw new NotFoundException(
      'Property not found',
    );
  }

  return {

    id: property.id,

    unit_number: property.unit_number,

    building: {

      id: property.building?.id,

      name: property.building?.name,
    },

    landlord: {

      id: property.landlord.id,

      name: property.landlord.name,
    },

    tenant:

      property.tenant
      ? {

          id: property.tenant.id,
          name: property.tenant.name,

        }
      : null,

    rent_amount: property.rent_amount,

    service_charge: property.service_charge,

    has_parking: property.has_parking,

    parking_fee: property.parking_fee,

    listing_status: property.listing_status,

    status: property.status,

    created_by: property.created_by,

    created_at: property.created_at,

  };

}

async searchProperty(keyword: string) {

  const properties = await this.propertyRepository.find({
    where: [
      {
        unit_number: ILike(`%${keyword}%`),
      },
      {
        created_by: ILike(`%${keyword}%`),
      },
    ],
    relations: {
      building: true,
      landlord: true,
      tenant: true,
    },
  });

  return properties.map((property) => ({
    id: property.id,
    unit_number: property.unit_number,

    building: property.building
      ? {
          id: property.building.id,
          name: property.building.name,
        }
      : null,

    landlord: {
      id: property.landlord.id,
      name: property.landlord.name,
    },

    tenant: property.tenant
      ? {
          id: property.tenant.id,
          name: property.tenant.name,
        }
      : null,

    rent_amount: property.rent_amount,
    service_charge: property.service_charge,
    has_parking: property.has_parking,
    parking_fee: property.parking_fee,
    listing_status: property.listing_status,
    status: property.status,
    created_by: property.created_by,
    created_at: property.created_at,
  }));
}

async updateProperty(
  id: number,
  updatePropertyDto: UpdatePropertyDto,
) {

  const property = await this.propertyRepository.findOne({
    where: { id },
    relations: {
      building: true,
      landlord: true,
    },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  if (updatePropertyDto.buildingId) {

    const building = await this.buildingRepository.findOne({
      where: {
        id: updatePropertyDto.buildingId,
      },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    property.building = building;
  }

  if (updatePropertyDto.landlordId) {

    const landlord = await this.landlordRepository.findOne({
      where: {
        id: updatePropertyDto.landlordId,
      },
    });

    if (!landlord) {
      throw new NotFoundException('Landlord not found');
    }

    property.landlord = landlord;
  }

  Object.assign(property, {
    unit_number: updatePropertyDto.unit_number ?? property.unit_number,
    rent_amount: updatePropertyDto.rent_amount ?? property.rent_amount,
    service_charge: updatePropertyDto.service_charge ?? property.service_charge,
    has_parking: updatePropertyDto.has_parking ?? property.has_parking,
    parking_fee: updatePropertyDto.parking_fee ?? property.parking_fee,
    listing_status: updatePropertyDto.listing_status ?? property.listing_status,
    status: updatePropertyDto.status ?? property.status,
  });

  const updatedProperty = await this.propertyRepository.save(property);

  return {
    message: 'Property updated successfully',
    property: updatedProperty,
  };
}

async deleteProperty(id: number) {

  const property = await this.propertyRepository.findOne({
    where: { id },
  });

  if (!property) {
    throw new NotFoundException('Property not found');
  }

  await this.propertyRepository.remove(property);

  return {
    message: 'Property deleted successfully',
  };
}

}