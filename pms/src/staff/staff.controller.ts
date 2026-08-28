import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

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

import { AuthModule } from '../auth/auth.module';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe)
  login(@Body() dto: LoginStaffDto) {
    return this.staffService.loginStaff(dto);
  }

  // ==========================================
  // STAFF PROFILE MANAGEMENT
  // ==========================================

  @Post('createStaff')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  createStaff(@Body() dto: staffDto) {
    return this.staffService.createStaff(dto);
  }

  @Get('viewAllStaff')
  @UseGuards(AuthModule)
  viewAllStaff() {
    return this.staffService.viewAllStaff();
  }

  @Delete('/:staffId')
  @UseGuards(AuthModule)
  deleteStaff(@Param('staffId', ParseIntPipe) id: number) {
    return this.staffService.deleteStaff(id);
  }

  @Get('findStaff/:id')
  @UseGuards(AuthModule)
  findStaff(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findStaff(id);
  }

  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================

  @Get('dashboard/stats')
  @UseGuards(AuthModule)
  getDashboardStats(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getDashboardStats(staffId);
  }

  @Get('dashboard/workload')
  @UseGuards(AuthModule)
  getWorkloadOverview(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getWorkloadOverview(staffId);
  }

  // ==========================================
  // WORKER MANAGEMENT
  // ==========================================

  @Post('/:staffId/workers')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  createWorker(
    @Body() dto: CreateWorkerDto,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    return this.staffService.createWorker(staffId, dto);
  }

  @Get('workers')
  @UseGuards(AuthModule)
  findAllWorkers(@Query() filterDto: FilterWorkerDto) {
    return this.staffService.findAllWorkers(filterDto);
  }

  @Get('workers/:id')
  @UseGuards(AuthModule)
  findWorkerById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWorker(id);
  }

  @Get('workers/:id/schedule')
  @UseGuards(AuthModule)
  getWorkerSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerSchedule(id);
  }

  @Get('workers/:id/performance')
  @UseGuards(AuthModule)
  getWorkerPerformance(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerPerformance(id);
  }

  @Patch('workers/:id')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  updateWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.staffService.updateWorker(id, dto);
  }

  @Delete('workers/:id')
  @UseGuards(AuthModule)
  deleteWorker(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @Patch('workers/:id/toggle-status')
  @UseGuards(AuthModule)
  toggleWorkerStatus(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.toggleWorkerStatus(id);
  }

  // ==========================================
  // WORK ORDER MANAGEMENT
  // ==========================================

  @Get('work-orders')
  @UseGuards(AuthModule)
  findAllWorkOrders(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.findAllWorkOrders(filterDto);
  }

  @Get('work-orders/export')
  @UseGuards(AuthModule)
  exportWorkOrders(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.exportWorkOrders(filterDto);
  }

  @Get('work-orders/:id')
  @UseGuards(AuthModule)
  findWorkOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWOrkOrder(id);
  }

  @Post('work-orders')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  createWorkOrder(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: CreateWorkOrderDto,
  ) {
    return this.staffService.createWorkOrder(staffId, dto);
  }

  @Patch('work-orders/:id')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  updateWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderDto,
  ) {
    return this.staffService.updateWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/dispatch')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DispatchWorkerDto,
  ) {
    return this.staffService.dispatchWorker(id, body);
  }

  @Patch('work-orders/:id/remove-worker')
  @UseGuards(AuthModule)
  removeWorkerFromOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @Patch('work-orders/:id/complete')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/confirm-tenant')
  @UseGuards(AuthModule)
  tenantConfirmWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.tenantConfirmWorkOrder(id);
  }

  @Patch('work-orders/:id/reopen')
  @UseGuards(AuthModule)
  reopenWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.reopenWorkOrder(id);
  }

  @Delete('work-orders/:id')
  @UseGuards(AuthModule)
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  // ==========================================
  // ISSUE MANAGEMENT
  // ==========================================

  @Get('issues')
  @UseGuards(AuthModule)
  findAllIssues(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.findAllIssues(filterDto);
  }

  @Get('issues/:id')
  @UseGuards(AuthModule)
  findIssueById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findIssue(id);
  }

  @Patch('issues/:id/status')
  @UseGuards(AuthModule)
  @UsePipes(new ValidationPipe())
  updateIssueStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IssueStatusDto,
  ) {
    return this.staffService.updateIssueStatus(id, dto);
  }

  @Post('issues/:id/convert-to-work-order')
  @UseGuards(AuthModule)
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
  @UseGuards(AuthModule)
  getAllProperties(@Query() query: any) {
    return this.staffService.getAllProperties(query);
  }

  @Get('properties/:id')
  @UseGuards(AuthModule)
  getPropertyDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findProperty(id);
  }

  @Get('buildings')
  @UseGuards(AuthModule)
  getAllBuildings(@Query() query: any) {
    return this.staffService.getAllBuildings(query);
  }

  @Get('blocks')
  @UseGuards(AuthModule)
  getAllBlocks(@Query() query: any) {
    return this.staffService.getAllBlocks(query);
  }

  @Get('landlords')
  @UseGuards(AuthModule)
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  @Get('tenants')
  @UseGuards(AuthModule)
  getAllTenants(@Query() query: any) {
    return this.staffService.getAllTenants(query);
  }

  @Get('tenants/:id')
  @UseGuards(AuthModule)
  getTenantDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findTanent(id);
  }

  @Get('admins')
  @UseGuards(AuthModule)
  getAllAdmins() {
    return this.staffService.getAllAdmins();
  }

  // ==========================================
  // REVIEWS
  // ==========================================

  @Get('work-orders/:id/review')
  @UseGuards(AuthModule)
  getReviewByOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }

  @Delete('deleteReview/:id')
  @UseGuards(AuthModule)
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteReview(id);
  }

  // ==========================================
  // REPORTS
  // ==========================================

  @Get('reports/worker-performance')
  @UseGuards(AuthModule)
  getWorkerPerformanceReport(@Query() query: any) {
    return this.staffService.getWorkerPerformanceReport(query);
  }

  @Get('reports/work-order-summary')
  @UseGuards(AuthModule)
  getWorkOrderSummaryReport(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.getWorkOrderSummaryReport(filterDto);
  }
}