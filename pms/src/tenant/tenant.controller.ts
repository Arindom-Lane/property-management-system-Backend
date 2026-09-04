import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { TenantService } from './tenant.service';

import { CreateTenantDto } from './dto/create-tenant.dto';
import { LoginTenantDto } from './dto/login-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

// import { CreatePaymentDto } from './dto/create-payment.dto';
// import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { PayBillDto } from './dto/pay-bill.dto';
@Controller('tenant')
export class TenantController {
  constructor(
    private readonly tenantService: TenantService,
  ) {}

  // ==========================
  // Register
  // ==========================

  @Post('createTenant')
  @UsePipes(new ValidationPipe())
  createTenant(
    @Body() dto: CreateTenantDto,
  ) {
    return this.tenantService.createTenant(dto);
  }

  // ==========================
  // Login
  // ==========================

  @Post('loginTenant')
  @UsePipes(new ValidationPipe())
  loginTenant(
    @Body() dto: LoginTenantDto,
  ) {
    return this.tenantService.loginTenant(dto);
  }

  // ==========================
  // Get All Tenant
  // ==========================

  @Get()
  getAllTenant() {
    return this.tenantService.getAllTenants();
  }

  // ==========================
  // Profile
  // ==========================

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  getTenantById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tenantService.getTenantById(id);
  }

  // ==========================
  // Update
  // ==========================

  @Patch('update/:id')
  @UsePipes(new ValidationPipe())
  updateTenant(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTenantDto,
  ) {
    return this.tenantService.updateTenant(id, dto);
  }

  // ==========================
  // Delete
  // ==========================

  @Delete('delete/:id')
  deleteTenant(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tenantService.deleteTenant(id);
  }

  @Delete('deleteByEmail/:email')
deleteTenantByEmail(
  @Param('email') email: string,
) {
  return this.tenantService.deleteTenantByEmail(email);
}
//   @Delete('delete')
// deleteTenantByEmail(
//   @Query('email') email: string,
// ) {
//   return this.tenantService.deleteTenantByEmail(email);
// }
  // ==========================
  // Property
  // ==========================

  @Get(':id/property')
  getAssignedProperty(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tenantService.getAssignedProperty(id);
  }

  // ==========================
  // Create Issue
  // ==========================

  @Post(':id/issues')
  @UsePipes(new ValidationPipe())
  createIssue(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateIssueDto,
  ) {
    return this.tenantService.createIssue(id, dto);
  }

  // ==========================
  // Get All Issues
  // ==========================

  @Get(':id/issues')
  getTenantIssues(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tenantService.getTenantIssues(id);
  }

  // ==========================
  // Get Single Issue
  // ==========================

  @Get('issues/:issueId')
  getIssueById(
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return this.tenantService.getIssueById(issueId);
  }

  // ==========================
  // Update Issue
  // ==========================

  @Patch('issues/:issueId')
  @UsePipes(new ValidationPipe())
  updateIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
    @Body() dto: UpdateIssueDto,
  ) {
    return this.tenantService.updateIssue(issueId, dto);
  }

  // ==========================
  // Delete Issue
  // ==========================

  @Delete('issues/:issueId')
  deleteIssue(
    @Param('issueId', ParseIntPipe) issueId: number,
  ) {
    return this.tenantService.deleteIssue(issueId);
  }
//pay rent
@Post('pay-rent/:tenantId')
payRent(
  @Param('tenantId', ParseIntPipe) tenantId: number,
  @Body() dto: CreateTransactionDto,
) {
  return this.tenantService.payRent(
    tenantId,
    dto,
  );
}

//make payment
@Post('payment/:tenantId')
makePayment(
  @Param('tenantId', ParseIntPipe) tenantId: number,
  @Body() dto: CreateTransactionDto,
) {
  return this.tenantService.makePayment(
    tenantId,
    dto,
  );
}
//get due bills
@Get('bills/due/:tenantId')
getDueBills(
  @Param('tenantId', ParseIntPipe)
  tenantId: number,
) {
  return this.tenantService.getDueBills(
    tenantId,
  );
}
//pay bill
@Post('pay-bill/:tenantId')
payBill(
  @Param('tenantId', ParseIntPipe)
  tenantId: number,

  @Body()
  dto: PayBillDto,
) {
  return this.tenantService.payBill(
    tenantId,
    dto.billId,
  );
}
//get payable work orders
@Get('work-orders/payable/:tenantId')
getPayableWorkOrders(
  @Param('tenantId', ParseIntPipe)
  tenantId: number,
) {
  return this.tenantService.getPayableWorkOrders(
    tenantId,
  );
}
//pay work order
@Post('work-order/pay/:tenantId/:workOrderId')
payWorkOrder(
  @Param('tenantId', ParseIntPipe) tenantId: number,
  @Param('workOrderId', ParseIntPipe) workOrderId: number,
) {
  return this.tenantService.payWorkOrder(
    tenantId,
    workOrderId,
  );
}
}