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

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

//   // ==========================
// // Pay Rent
// // ==========================

// @Post(':id/pay-rent')
// @UsePipes(new ValidationPipe())
// payRent(
//   @Param('id', ParseIntPipe) id: number,
//   @Body() dto: CreatePaymentDto,
// ) {
//   return this.tenantService.payRent(id, dto);
// }

// // ==========================
// // Get Payments
// // ==========================

// @Get(':id/payments')
// getPayments(
//   @Param('id', ParseIntPipe) id: number,
// ) {
//   return this.tenantService.getPayments(id);
// }

// // ==========================
// // Get Single Payment
// // ==========================

// @Get('payment/:paymentId')
// getPaymentById(
//   @Param('paymentId', ParseIntPipe) paymentId: number,
// ) {
//   return this.tenantService.getPaymentById(paymentId);
// }

// // ==========================
// // Update Payment
// // ==========================
// //eta not needed, karon payment update korar dorkar nai, karon payment er status update hobe landlord er approval er por
// @Patch('payment/:paymentId')
// @UsePipes(new ValidationPipe())
// updatePayment(
//   @Param('paymentId', ParseIntPipe) paymentId: number,
//   @Body() dto: UpdatePaymentDto,
// ) {
//   return this.tenantService.updatePayment(paymentId, dto);
// }

// // ==========================
// // Delete Payment
// // ==========================

// @Delete('payment/:paymentId')
// deletePayment(
//   @Param('paymentId', ParseIntPipe) paymentId: number,
// ) {
//   return this.tenantService.deletePayment(paymentId);
// }
// }
}