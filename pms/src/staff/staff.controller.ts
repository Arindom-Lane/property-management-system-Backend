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

import { AuthGuard } from './StaffAuth/guard/auth.guard';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: LoginStaffDto) {
    return this.staffService.loginStaff(dto);
  }

  // ==========================================
  // STAFF PROFILE MANAGEMENT
  // ==========================================

  @Post('createStaff')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createStaff(@Body() dto: staffDto) {
    return this.staffService.createStaff(dto);
  }

  @Get('viewAllStaff')
  @UseGuards(AuthGuard)
  viewAllStaff() {
    return this.staffService.viewAllStaff();
  }

  @Delete('/:staffId')
  @UseGuards(AuthGuard)
  deleteStaff(@Param('staffId', ParseIntPipe) id: number) {
    return this.staffService.deleteStaff(id);
  }

  @Get('findStaff/:id')
  @UseGuards(AuthGuard)
  findStaff(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findStaff(id);
  }

  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================

  @Get('dashboard/stats')
  @UseGuards(AuthGuard)
  getDashboardStats(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getDashboardStats(staffId);
  }

  @Get('dashboard/workload')
  @UseGuards(AuthGuard)
  getWorkloadOverview(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getWorkloadOverview(staffId);
  }

  // ==========================================
  // WORKER MANAGEMENT
  // ==========================================

  @Post('/:staffId/workers')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createWorker(
    @Body() dto: CreateWorkerDto,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    return this.staffService.createWorker(staffId, dto);
  }

  @Get('workers')
  @UseGuards(AuthGuard)
  findAllWorkers(@Query() filterDto: FilterWorkerDto) {
    return this.staffService.findAllWorkers(filterDto);
  }

  @Get('workers/:id')
  @UseGuards(AuthGuard)
  findWorkerById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWorker(id);
  }

  @Get('workers/:id/schedule')
  @UseGuards(AuthGuard)
  getWorkerSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerSchedule(id);
  }

  @Get('workers/:id/performance')
  @UseGuards(AuthGuard)
  getWorkerPerformance(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerPerformance(id);
  }

  @Patch('workers/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.staffService.updateWorker(id, dto);
  }

  @Delete('workers/:id')
  @UseGuards(AuthGuard)
  deleteWorker(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @Patch('workers/:id/toggle-status')
  @UseGuards(AuthGuard)
  toggleWorkerStatus(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.toggleWorkerStatus(id);
  }

  // ==========================================
  // WORK ORDER MANAGEMENT
  // ==========================================

  @Get('work-orders')
  @UseGuards(AuthGuard)
  findAllWorkOrders(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.findAllWorkOrders(filterDto);
  }

  @Get('work-orders/export')
  @UseGuards(AuthGuard)
  exportWorkOrders(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.exportWorkOrders(filterDto);
  }

  @Get('work-orders/:id')
  @UseGuards(AuthGuard)
  findWorkOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWOrkOrder(id);
  }

  @Post('work-orders')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createWorkOrder(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: CreateWorkOrderDto,
  ) {
    return this.staffService.createWorkOrder(staffId, dto);
  }

  @Patch('work-orders/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderDto,
  ) {
    return this.staffService.updateWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/dispatch')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DispatchWorkerDto,
  ) {
    return this.staffService.dispatchWorker(id, body);
  }

  @Patch('work-orders/:id/remove-worker')
  @UseGuards(AuthGuard)
  removeWorkerFromOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @Patch('work-orders/:id/complete')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/confirm-tenant')
  @UseGuards(AuthGuard)
  tenantConfirmWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.tenantConfirmWorkOrder(id);
  }

  @Patch('work-orders/:id/reopen')
  @UseGuards(AuthGuard)
  reopenWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.reopenWorkOrder(id);
  }

  @Delete('work-orders/:id')
  @UseGuards(AuthGuard)
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  // ==========================================
  // ISSUE MANAGEMENT
  // ==========================================

  @Get('issues')
  @UseGuards(AuthGuard)
  findAllIssues(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.findAllIssues(filterDto);
  }

  @Get('issues/:id')
  @UseGuards(AuthGuard)
  findIssueById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findIssue(id);
  }

  @Patch('issues/:id/status')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateIssueStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IssueStatusDto,
  ) {
    return this.staffService.updateIssueStatus(id, dto);
  }

  @Post('issues/:id/convert-to-work-order')
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  getAllProperties(@Query() query: any) {
    return this.staffService.getAllProperties(query);
  }

  @Get('properties/:id')
  @UseGuards(AuthGuard)
  getPropertyDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findProperty(id);
  }

  @Get('buildings')
  @UseGuards(AuthGuard)
  getAllBuildings(@Query() query: any) {
    return this.staffService.getAllBuildings(query);
  }

  @Get('blocks')
  @UseGuards(AuthGuard)
  getAllBlocks(@Query() query: any) {
    return this.staffService.getAllBlocks(query);
  }

  @Get('landlords')
  @UseGuards(AuthGuard)
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  @Get('tenants')
  @UseGuards(AuthGuard)
  getAllTenants(@Query() query: any) {
    return this.staffService.getAllTenants(query);
  }

  @Get('tenants/:id')
  @UseGuards(AuthGuard)
  getTenantDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findTanent(id);
  }

  @Get('admins')
  @UseGuards(AuthGuard)
  getAllAdmins() {
    return this.staffService.getAllAdmins();
  }

  // ==========================================
  // REVIEWS
  // ==========================================

  @Get('work-orders/:id/review')
  @UseGuards(AuthGuard)
  getReviewByOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }

  @Delete('deleteReview/:id')
  @UseGuards(AuthGuard)
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteReview(id);
  }

  // ==========================================
  // REPORTS
  // ==========================================

  @Get('reports/worker-performance')
  @UseGuards(AuthGuard)
  getWorkerPerformanceReport(@Query() query: any) {
    return this.staffService.getWorkerPerformanceReport(query);
  }

  @Get('reports/work-order-summary')
  @UseGuards(AuthGuard)
  getWorkOrderSummaryReport(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.getWorkOrderSummaryReport(filterDto);
  }
}