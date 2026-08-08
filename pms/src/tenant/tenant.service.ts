import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { TenantEntity } from './entities/tenant.entity';
import { IssueEntity } from './entities/issue.entity';

import { PropertyEntity } from 'src/landlord/entities/property.entity';
import { LandlordEntity } from 'src/landlord/entities/landlord.entity';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { LoginTenantDto } from './dto/login-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';


// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';

import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,

    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,

    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,

    @InjectRepository(LandlordEntity)
    private readonly landlordRepository: Repository<LandlordEntity>,

    
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  
  // Register Tenant
 
async createTenant(
  dto: CreateTenantDto,
): Promise<TenantEntity> {
    const existingTenant = await this.tenantRepository.findOne({
      where: [
        { email: dto.email },
        { phone: dto.phone },
        { nid_number: dto.nid_number },
      ],
    });

    if (existingTenant) {
      throw new BadRequestException(
        'Tenant already exists.',
      );
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );

    const tenant = this.tenantRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password_hash: hashedPassword,
      nid_number: dto.nid_number,
      nid_document_url: dto.nid_document_url,
      has_vehicle: dto.has_vehicle ?? false,
    });

    // return await this.tenantRepository.save(tenant);

  // Save tenant
  const savedTenant = await this.tenantRepository.save(tenant);

  // Send welcome mail
  await this.mailService.sendWelcomeMail(
    savedTenant.email,
    savedTenant.name,
  );

  // Return response
  return savedTenant;
}
  // const raj= await this.tenantRepository.save(tenant);
  // return{
  //   message: 'Tenant created successfully',
  //   email: raj.email,
  //   phone: raj.phone,
  //   nid_number: raj.nid_number,   
  // }
  
  

  // ============================
  // Login
  // ============================

async loginTenant(
  dto: LoginTenantDto,
): Promise<any> {
    const tenant = await this.tenantRepository.findOne({
      where: {
        // email: dto.email,
          phone: dto.phone,
      },
    });

    if (!tenant) {
      throw new NotFoundException(
        'Tenant not found.',
      );
    }

    const isMatched = await bcrypt.compare(
      dto.password,
      tenant.password_hash,
    );

    if (!isMatched) {
      throw new ForbiddenException(
        'Incorrect password.',
      );
    }

    const payload = {
  id: tenant.id,
  email: tenant.email,
};

return {
  message: 'Login Successful',
  access_token: this.jwtService.sign(payload),
  tenant,
};
  }

  // ============================
  // Get All Tenants
  // ============================

  async getAllTenants(): Promise<TenantEntity[]> {
    return await this.tenantRepository.find();
  }

  // ============================
  // Get Tenant By ID
  // ============================

  async getTenantById(
    id: number,
  ): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findOne({
      where: {
        id,
      },
    });

    if (!tenant) {
      throw new NotFoundException(
        'Tenant not found.',
      );
    }

    return tenant;
  }
  // ============================
// Update Tenant
// ============================

async updateTenant(
  id: number,
  updateData: UpdateTenantDto,
): Promise<TenantEntity> {
  const tenant = await this.tenantRepository.findOne({
    where: { id },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  // Email Duplicate Check
  if (updateData.email && updateData.email !== tenant.email) {
    const existingEmail = await this.tenantRepository.findOne({
      where: { email: updateData.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already exists.');
    }
  }

  // Password Hash
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);

    tenant.password_hash = updateData.password;

    delete updateData.password;
  }

  Object.assign(tenant, updateData);

  return await this.tenantRepository.save(tenant);
}

// ============================
// Delete Tenant
// ============================

async deleteTenant(
  id: number,
): Promise<{ message: string }> {

  const tenant = await this.tenantRepository.findOne({
    where: { id },
  });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }

  await this.tenantRepository.delete(id);

  return {
    message: 'Tenant deleted successfully.',
  };
}

async deleteTenantByEmail(
  email: string,
): Promise<{ message: string }> {

  const tenant = await this.tenantRepository.findOne({
    where: { email },
  });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }

  await this.tenantRepository.delete({
    email,
  });

  return {
    message: 'Tenant deleted successfully.',
  };
}

//Assigned Property for bad request exception


async getAssignedProperty(id: number): Promise<PropertyEntity> {
  const tenant = await this.tenantRepository.findOne({
    where: { id },
    relations: {
      property: true,
    },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  if (!tenant.property) {
    throw new BadRequestException(
      'No property assigned yet.',
    );
  }

  return tenant.property;
}
async createIssue(
  tenantId: number,
  dto: CreateIssueDto,
): Promise<IssueEntity> {

  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
    relations: {
      property: true,
    },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  if (!tenant.property) {
    throw new BadRequestException(
      'Property is not assigned yet.',
    );
  }

  const issue = this.issueRepository.create({
    description: dto.description,
    image_url: dto.image_url,
    tenant,
    property: tenant.property,
  });

  return await this.issueRepository.save(issue);
}
/*async getAssignedProperty(
  id: number,
): Promise<any> {

  const tenant = await this.tenantRepository.findOne({
    where: { id },
  });

  if (!tenant) {
    throw new NotFoundException(
      'Tenant not found.',
    );
  }

  return {
    id: 1,
    unit_number: 'A-101',
    rent_amount: 15000,
    listing_status: 'for_rent',
    status: 'occupied',
    landlord: 'Demo Landlord',
  };
}
//create issue
async createIssue(
  tenantId: number,
  dto: CreateIssueDto,
): Promise<any> {
  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
    relations: {
      property: true,
    },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

//   if (!tenant.property) {
//     throw new BadRequestException(
//       'Property is not assigned yet.',
//     );
//   }
//   const issue = this.issueRepository.create({
//   description: dto.description,
//   image_url: dto.image_url,
//   tenant,
// });

  const issue = this.issueRepository.create({
  description: dto.description,
  image_url: dto.image_url,
  tenant,
  property: tenant.property ?? null,
});

  return await this.issueRepository.save(issue);
}*/
// get all issues of a tenant
async getTenantIssues(
  tenantId: number,
// ): Promise<IssueEntity[]> {
): Promise<any[]> {
  const tenant = await this.tenantRepository.findOne({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new NotFoundException('Tenant not found.');
  }

  // return await this.issueRepository.find({
  //   where: {
  //     tenant: {
  //       id: tenantId,
  //     },
  //   },
  // });
  const issues = await this.issueRepository.find({
  where: {
    tenant: {
      id: tenantId,
    },
  },
});

return issues.map((issue) => ({
  id: issue.id,
  tenant: {
    id: issue.tenant.id,
    name: issue.tenant.name,
    phone: issue.tenant.phone,
  },
  description: issue.description,
  image_url: issue.image_url,
  status: issue.status,
  created_at: issue.created_at,
}));
}
//get issue by id
async getIssueById(
  issueId: number,
): Promise<any> {
  const issue = await this.issueRepository.findOne({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    throw new NotFoundException(
      'Issue not found.',
    );
  }

  // return issue;
  return {
  id: issue.id,
  tenant: {
    id: issue.tenant.id,
    name: issue.tenant.name,
    phone: issue.tenant.phone,
  },
  description: issue.description,
  image_url: issue.image_url,
  status: issue.status,
  created_at: issue.created_at,
};
}
//update issue
async updateIssue(
  issueId: number,
  dto: UpdateIssueDto,
): Promise<any> {
  const issue = await this.issueRepository.findOne({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    throw new NotFoundException(
      'Issue not found.',
    );
  }

  Object.assign(issue, dto);

  return await this.issueRepository.save(issue);
}
//delete issue
async deleteIssue(
  issueId: number,
): Promise<void> {
  const issue = await this.issueRepository.findOne({
    where: {
      id: issueId,
    },
  });

  if (!issue) {
    throw new NotFoundException(
      'Issue not found.',
    );
  }

  await this.issueRepository.delete(issueId);
}
// // ============================
// // Pay Rent
// // ============================

// async payRent(
//   tenantId: number,
//   dto: CreatePaymentDto,
// ): Promise<PaymentEntity> {

//   const tenant = await this.tenantRepository.findOne({
//     where: { id: tenantId },
//     relations: {
//       property: true,
//     },
//   });

//   if (!tenant) {
//     throw new NotFoundException('Tenant not found.');
//   }

//   // if (!tenant.property) {
//   //   throw new BadRequestException(
//   //     'No property assigned.',
//   //   );
//   // }

//   const exists = await this.paymentRepository.findOne({
//     where: {
//       transaction_id: dto.transaction_id,
//     },
//   });

//   if (exists) {
//     throw new BadRequestException(
//       'Transaction ID already exists.',
//     );
//   }

//   // const payment = this.paymentRepository.create({
//   //   ...dto,
//   //   tenant,
//   //   property: tenant.property,
//   // });

//   // return await this.paymentRepository.save(payment);
//   const payment = this.paymentRepository.create({
//   ...dto,
//   tenant,
//   property: tenant.property ?? null,
// });

// return await this.paymentRepository.save(payment);
// }

// async getPayments(
//   tenantId: number,
// ): Promise<PaymentEntity[]> {

//   return await this.paymentRepository.find({
//     where: {
//       tenant: {
//         id: tenantId,
//       },
//     },
//   });
// }

// async getPaymentById(
//   paymentId: number,
// ): Promise<PaymentEntity> {

//   const payment = await this.paymentRepository.findOne({
//     where: {
//       id: paymentId,
//     },
//   });

//   if (!payment) {
//     throw new NotFoundException(
//       'Payment not found.',
//     );
//   }

//   return payment;
//   //   // id: payment.id,
//   //   // tenant: {
//   //     id: payment.tenant.id,
//   //     name: payment.tenant.name,
//   //     phone: payment.tenant.phone,
//   //   // },
//   // }
  
  
// }

// // Update Payment


// async updatePayment(
//   paymentId: number,
//   dto: UpdatePaymentDto,
// ): Promise<PaymentEntity> {

//   const payment = await this.paymentRepository.findOne({
//     where: {
//       id: paymentId,
//     },
//   });

//   if (!payment) {
//     throw new NotFoundException(
//       'Payment not found.',
//     );
//   }

//   Object.assign(payment, dto);

//   return await this.paymentRepository.save(payment);
// }
// // ============================
// // Delete Payment
// // ============================

// async deletePayment(
//   paymentId: number,
// ): Promise<{ message: string }> {

//   const payment = await this.paymentRepository.findOne({
//     where: {
//       id: paymentId,
//     },
//   });

//   if (!payment) {
//     throw new NotFoundException(
//       'Payment not found.',
//     );
//   }

//   await this.paymentRepository.delete(paymentId);

//   return {
//     message: 'Payment deleted successfully.',
//   };
// }
 }
