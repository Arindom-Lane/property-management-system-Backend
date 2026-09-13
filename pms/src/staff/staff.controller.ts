import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StaffOnlyGuard } from './auth/staff.guard';
import { StaffService } from './staff.service';

import { staffDto } from './dto/staff.dto';
import { LoginStaffDto } from './dto/LoginStaff.dto';

import { CreateWorkOrderDto } from './dto/CreateWorkOrder.dto';
import { DispatchWorkerDto } from './dto/DispatchWorkOrder.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { CompleteWorkOrderDto } from './dto/CompleteWorkOrder.dto';
import { UpdateWorkOrderDto } from './dto/UpdateWorkOrder.dto';
import { FilterWorkOrderDto } from './dto/FilterWorkOrder.dto';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';
import { FilterWorkerDto } from './dto/FilterWorker.dto';

import { IssueStatusDto } from './dto/IssueStatus.dto';
import { ConvertIssueDto } from './dto/ConvertIssue.dto';
import { UpdateStaffProfileDto } from './dto/UpdateStaffProfile.dto';

import { AuthGuard } from '../auth/auth.guard';
import { AccountType } from '../auth/dto/login.dto';
import { JwtPayload } from '../auth/auth.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(new ValidationPipe)
  // login(@Body() dto: LoginStaffDto) {
  //   return this.staffService.loginStaff(dto);
  // }

  // ==========================================
  // STAFF PROFILE MANAGEMENT
  // ==========================================

  @Post('createStaff')
  @UsePipes(new ValidationPipe())
  createStaff(@Body() dto: staffDto) {
    return this.staffService.createStaff(dto);
  }

  @Get('viewAllStaff')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  viewAllStaff() {
    return this.staffService.viewAllStaff();
  }

  @Delete('/:staffId')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  deleteStaff(@Param('staffId', ParseIntPipe) id: number) {
    return this.staffService.deleteStaff(id);
  }

  @Get('findStaff/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findStaff(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findStaff(id);
  }

  @Patch('profile')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  updateProfile(
    @Req() request: { user: JwtPayload },
    @Body() dto: UpdateStaffProfileDto,
  ) {
    if (request.user.accountType !== AccountType.STAFF) {
      throw new ForbiddenException('Only staff can update a staff profile');
    }

    return this.staffService.updateStaffProfile(request.user.sub, dto);
  }

  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================

  @Get('dashboard/stats')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getDashboardStats(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getDashboardStats(staffId);
  }

  @Get('dashboard/workload')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getWorkloadOverview(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getWorkloadOverview(staffId);
  }

  // ==========================================
  // WORKER MANAGEMENT
  // ==========================================

  @Post('/:staffId/workers')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  createWorker(
    @Body() dto: CreateWorkerDto,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    return this.staffService.createWorker(staffId, dto);
  }

  @Get('workers')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findAllWorkers(@Query() filterDto: FilterWorkerDto) {
    return this.staffService.findAllWorkers(filterDto);
  }

  @Get('workers/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findWorkerById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWorker(id);
  }

  @Get('workers/:id/schedule')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getWorkerSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerSchedule(id);
  }

  @Get('workers/:id/performance')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getWorkerPerformance(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerPerformance(id);
  }

  @Patch('workers/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  updateWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.staffService.updateWorker(id, dto);
  }

  @Delete('workers/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  deleteWorker(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @Patch('workers/:id/toggle-status')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  toggleWorkerStatus(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.toggleWorkerStatus(id);
  }

  // ==========================================
  // WORK ORDER MANAGEMENT
  // ==========================================

  @Get('work-orders')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findAllWorkOrders() {
    return this.staffService.findAllWorkOrders();
  }

  @Get('work-orders/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findWorkOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWOrkOrder(id);
  }

  @Post('work-orders')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  createWorkOrder(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: CreateWorkOrderDto,
  ) {
    return this.staffService.createWorkOrder(staffId, dto);
  }

  @Patch('work-orders/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  updateWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderDto,
  ) {
    return this.staffService.updateWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/dispatch')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DispatchWorkerDto,
  ) {
    return this.staffService.dispatchWorker(id, body);
  }

  @Patch('work-orders/:id/remove-worker')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  removeWorkerFromOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @Patch('work-orders/:id/complete')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/confirm-tenant')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  tenantConfirmWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.tenantConfirmWorkOrder(id);
  }

  @Patch('work-orders/:id/reopen')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  reopenWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.reopenWorkOrder(id);
  }

  @Delete('work-orders/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  // ==========================================
  // ISSUE MANAGEMENT
  // ==========================================

  @Get('issues')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findAllIssues (@Query('tenantId', new ParseIntPipe({ optional: true })) tenantId: number) {
    return this.staffService.findAllIssues(tenantId);
  }
  @Get('issues/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  findIssueById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findIssue(id);
  }

  @Patch('issues/:id/status')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  updateIssueStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IssueStatusDto,
  ) {
    return this.staffService.updateIssueStatus(id, dto);
  }

  @Post('issues/:id/convert-to-work-order')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  @UsePipes(new ValidationPipe())
  convertIssueToWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: ConvertIssueDto,
  ) {
    return this.staffService.convertIssueToWorkOrder(id, staffId, dto);
  }

  // ==========================================
  // PROPERTY, BUILDING, BLOCK, LANDLORD,
  // TENANT CONTEXT
  // ==========================================

  @Get('properties')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getAllProperties(
    @Query('landlordId') landlordId?: number,
    @Query('buildingId') buildingId?: number,
  ) {
    return this.staffService.getAllProperties({ landlordId, buildingId });
  }

  @Get('properties/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getPropertyDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findProperty(id);
  }

  @Get('buildings')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getAllBuildings(@Query() query: any) {
    return this.staffService.getAllBuildings(query);
  }

  @Get('blocks')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getAllBlocks(@Query() query: any) {
    return this.staffService.getAllBlocks(query);
  }

  @Get('landlords')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  @Get('tenants')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getAllTenants(@Query() query: any) {
    return this.staffService.getAllTenants(query);
  }

  @Get('tenants/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getTenantDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findTanent(id);
  }

  @Get('admins')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getAllAdmins() {
    return this.staffService.getAllAdmins();
  }

  // ==========================================
  // REVIEWS
  // ==========================================

  @Get('work-orders/:id/review')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getReviewByOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }

  @Delete('deleteReview/:id')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteReview(id);
  }

  // ==========================================
  // REPORTS
  // ==========================================

  @Get('reports/worker-performance')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getWorkerPerformanceReport(@Query() query: any) {
    return this.staffService.getWorkerPerformanceReport(query);
  }

  @Get('reports/work-order-summary')
  @UseGuards(AuthGuard, StaffOnlyGuard)
  getWorkOrderSummaryReport(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.getWorkOrderSummaryReport(filterDto);
  }
}
