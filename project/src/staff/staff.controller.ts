// staff.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { StaffService } from './staff.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { CompleteWorkOrderDto } from './dto/complete-work-order.dto';
import { DispatchWorkOrderDto } from './dto/dispatch-work-order.dto';
import { CreateWorkOrderDto } from './dto/create-work-oder.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('workers')
  createWorker(@Body() dto: CreateWorkerDto) {
    return this.staffService.createWorker(dto);
  }

  @Get('workers')
  findAllWorkers() {
    return this.staffService.findAllWorkers();
  }

  @Patch('workers/:id')
  updateWorkerName(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkerDto,
  ) {
    return this.staffService.updateWorkerName(id, dto);
  }

  @Delete('workers/:id')
  deleteWorker(@Param('id', ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @Get('work-orders')
  findAllWorkOrders() {
    return this.staffService.findAllWorkOrders();
  }

  @Post('work-orders')
  createWorkOrder(@Body() dto: CreateWorkOrderDto) {
    return this.staffService.createWorkOrder(dto);
  }

  @Patch('work-orders/:id/dispatch')
  dispatchWorker(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DispatchWorkOrderDto,
  ) {
    return this.staffService.dispatchWorker(id, dto);
  }

  @Patch('work-orders/:id/remove-worker')
  removeWorkerFromOrder(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @Patch('work-orders/:id/complete')
  completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @Delete('work-orders/:id')
  deleteOrder(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.staffService.deleteOrder(id);
  }

  @Post('work-orders/:id/review')
createReview(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: CreateReviewDto,
) {
  return this.staffService.createReview(id, dto);
}
}
