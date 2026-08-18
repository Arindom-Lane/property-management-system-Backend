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
import { CreateWorkOrderDto } from './dto/CreateWorkOrder.dto';
import { DispatchWorkerDto } from './dto/DispatchWorkOrder.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { CompleteWorkOrderDto } from './dto/CompleteWorkOrder.dto';
import { UpdateWorkOrderDto } from './dto/UpdateWorkOrder.dto';
import { FilterWorkOrderDto } from './dto/FilterWorkOrder.dto';
import { UpdateWorkerDto } from './dto/UpdateWorker.dto';
import { FilterWorkerDto } from './dto/FilterWorker.dto';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { FilterTransactionDto } from './dto/FilterTransaction.dto';
import { IssueStatusDto } from './dto/IssueStatus.dto';
import { ConvertIssueDto } from './dto/ConvertIssue.dto';
import { AuthGuard } from './StaffAuth/guard/auth.guard';

@Controller('staff')
@UseGuards(AuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // ==========================================
  // STAFF PROFILE MANAGEMENT
  // ==========================================
  @Post('createStaff')
  @UsePipes(new ValidationPipe())
  createStaff(@Body() dto: staffDto) {
    return this.staffService.createStaff(dto);
  }

  @Get('viewAllStaff')
  viewAllStaff() {
    return this.staffService.viewAllStaff();
  }

  @Delete('/:staffId')
  deleteStaff(@Param('staffId', ParseIntPipe) id: number) {
    return this.staffService.deleteStaff(id);
  }

  @Get('findStaff/:id')
  findStaff(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findStaff(id);
  }

  // ==========================================
  // DASHBOARD & ANALYTICS
  // ==========================================
  @Get('dashboard/stats')
  getDashboardStats(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getDashboardStats(staffId);
  }

  @Get('dashboard/workload')
  getWorkloadOverview(@Query('staffId', ParseIntPipe) staffId: number) {
    return this.staffService.getWorkloadOverview(staffId);
  }

  // ==========================================
  // WORKER MANAGEMENT
  // ==========================================
  @Post('/:staffId/workers')
  @UsePipes(new ValidationPipe())
  createWorker(
    @Body() dto: CreateWorkerDto,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    return this.staffService.createWorker(staffId, dto);
  }

  @Get('workers')
  findAllWorkers(@Query() filterDto: FilterWorkerDto) {
    return this.staffService.findAllWorkers(filterDto);
  }

  @Get('workers/:id')
  findWorkerById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWorker(id);
  }

  @Get('workers/:id/schedule')
  getWorkerSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerSchedule(id);
  }

  @Get('workers/:id/performance')
  getWorkerPerformance(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkerPerformance(id);
  }

  @Patch('workers/:id')
  @UsePipes(new ValidationPipe())
  updateWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.staffService.updateWorker(id, dto);
  }

  @Delete('workers/:id')
  deleteWorker(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @Patch('workers/:id/toggle-status')
  toggleWorkerStatus(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.toggleWorkerStatus(id);
  }

  // ==========================================
  // WORK ORDER MANAGEMENT (CORE)
  // ==========================================
  @Get('work-orders')
  findAllWorkOrders(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.findAllWorkOrders(filterDto);
  }

  @Get('work-orders/export')
  exportWorkOrders(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.exportWorkOrders(filterDto);
  }

  @Get('work-orders/:id')
  findWorkOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findWOrkOrder(id);
  }

  @Post('work-orders')
  @UsePipes(new ValidationPipe())
  createWorkOrder(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: CreateWorkOrderDto,
  ) {
    return this.staffService.createWorkOrder(staffId, dto);
  }

  @Patch('work-orders/:id')
  @UsePipes(new ValidationPipe())
  updateWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderDto,
  ) {
    return this.staffService.updateWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/dispatch')
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DispatchWorkerDto,
  ) {
    return this.staffService.dispatchWorker(id, body);
  }

  @Patch('work-orders/:id/remove-worker')
  removeWorkerFromOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @Patch('work-orders/:id/complete')
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @Patch('work-orders/:id/confirm-tenant')
  tenantConfirmWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.tenantConfirmWorkOrder(id);
  }

  @Patch('work-orders/:id/reopen')
  reopenWorkOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.reopenWorkOrder(id);
  }

  @Delete('work-orders/:id')
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  // ==========================================
  // ISSUE MANAGEMENT (TRIAGE)
  // ==========================================
  @Get('issues')
  findAllIssues(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.findAllIssues(filterDto);
  }

  @Get('issues/:id')
  findIssueById(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findIssue(id);
  }

  @Patch('issues/:id/status')
  @UsePipes(new ValidationPipe())
  updateIssueStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: IssueStatusDto,
  ) {
    return this.staffService.updateIssueStatus(id, dto);
  }

  @Post('issues/:id/convert-to-work-order')
  @UsePipes(new ValidationPipe())
  convertIssueToWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: ConvertIssueDto,
  ) {
    return this.staffService.convertIssueToWorkOrder(id, staffId, dto);
  }

  // ==========================================
  // PROPERTY, BUILDING, BLOCK, LANDLORD, TENANT CONTEXT (READ-ONLY)
  // ==========================================
  @Get('properties')
  getAllProperties(@Query() query: any) {
    return this.staffService.getAllProperties(query);
  }

  @Get('properties/:id')
  getPropertyDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findProperty(id);
  }

  @Get('buildings')
  getAllBuildings(@Query() query: any) {
    return this.staffService.getAllBuildings(query);
  }

  @Get('blocks')
  getAllBlocks(@Query() query: any) {
    return this.staffService.getAllBlocks(query);
  }

  @Get('landlords')
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  @Get('tenants')
  getAllTenants(@Query() query: any) {
    return this.staffService.getAllTenants(query);
  }

  @Get('tenants/:id')
  getTenantDetails(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findTanent(id);
  }

  @Get('admins')
  getAllAdmins() {
    return this.staffService.getAllAdmins();
  }

  // ==========================================
  // TRANSACTIONS & FINANCIALS
  // ==========================================
  @Get('transactions')
  getTransactions(@Query() filterDto: FilterTransactionDto) {
    return this.staffService.getTransactions(filterDto);
  }

  @Post('transactions')
  @UsePipes(new ValidationPipe())
  createTransaction(
    @Query('staffId', ParseIntPipe) staffId: number,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.staffService.createTransaction(staffId, dto);
  }

  @Get('work-orders/:id/transactions')
  getWorkOrderTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getWorkOrderTransactions(id);
  }

  // ==========================================
  // REVIEWS
  // ==========================================
  @Get('work-orders/:id/review')
  getReviewByOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }

  @Delete('deleteReview/:id')
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteReview(id);
  }

  // ==========================================
  // REPORTS
  // ==========================================
  @Get('reports/worker-performance')
  getWorkerPerformanceReport(@Query() query: any) {
    return this.staffService.getWorkerPerformanceReport(query);
  }

  @Get('reports/work-order-summary')
  getWorkOrderSummaryReport(@Query() filterDto: FilterWorkOrderDto) {
    return this.staffService.getWorkOrderSummaryReport(filterDto);
  }

  @Get('reports/financial-summary')
  getFinancialSummary(@Query() filterDto: FilterTransactionDto) {
    return this.staffService.getFinancialSummary(filterDto);
  }
}
