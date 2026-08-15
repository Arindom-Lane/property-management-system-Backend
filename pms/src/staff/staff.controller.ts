import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { StaffService } from './staff.service';
import { staffDto } from './dto/staff.dto';
import { CreateWorkOrderDto } from './dto/CreateWorkOrder.dto';
import { DispatchWorkerDto } from './dto/DispatchWorkOrder.dto';
import { CreateWorkerDto } from './dto/CreateWorker.dto';
import { CompleteWorkOrderDto } from './dto/CompleteWorkOrder.dto';
import { AuthGuard } from './StaffAuth/guard/auth.guard';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  //staff entity

  @UseGuards(AuthGuard)
  @Post('createStaff')
  @UsePipes(new ValidationPipe())
  createStaff(@Body() dto: staffDto) {
    return this.staffService.createStaff(dto);
  }

  @UseGuards(AuthGuard)
  @Get('viewAllStaff')
  viewAllStaff() {
    return this.staffService.viewAllStaff();
  }

  @UseGuards(AuthGuard)
  @Delete('/:staffId')
  deleteStaff(@Param('staffId', ParseIntPipe) id: number) {
    return this.staffService.deleteStaff(id);
  }

  @UseGuards(AuthGuard)
  @Post('findStaff/:id')
  findStaff(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.findStaff(id);
  }

  // STAFF's ACTUAL WORK

  @UseGuards(AuthGuard)
  @Post('/:staffId/workers')
  @UsePipes(new ValidationPipe())
  createWorker(
    @Body() dto: CreateWorkerDto,
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    return this.staffService.createWorker(staffId, dto);
  }

  @UseGuards(AuthGuard)
  @Get('workers')
  findAllWorkers() {
    return this.staffService.findAllWorkers();
  }

  @UseGuards(AuthGuard)
  @Patch('workers/:id')
  @UsePipes(new ValidationPipe())
  updateWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateWorkerDto,
  ) {
    return this.staffService.updateWorker(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('workers/:id')
  deleteWorker(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @UseGuards(AuthGuard)
  @Get('work-orders')
  findAllWorkOrders() {
    return this.staffService.findAllWorkOrders();
  }

  @UseGuards(AuthGuard)
  @Post('work-orders/:id')
  @UsePipes(new ValidationPipe())
  createWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateWorkOrderDto,
  ) {
    return this.staffService.createWorkOrder(id, dto);
  }

  @UseGuards(AuthGuard)
  @Patch('work-orders/:id/dispatch')
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: DispatchWorkerDto,
  ) {
    return this.staffService.dispatchWorker(id, body);
  }

  @UseGuards(AuthGuard)
  @Patch('work-orders/:id/remove-worker')
  removeWorkerFromOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @UseGuards(AuthGuard)
  @Patch('work-orders/:id/complete')
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('work-orders/:id')
  deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  @UseGuards(AuthGuard)
  @Get('landloards')
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  @UseGuards(AuthGuard)
  @Get('work-orders/:id/review')
  getReviewByOrder(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }


  @Delete('deleteReview/:id')
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteReview(id);
  }
}
