import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { StaffService } from './staff.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UpdateWorkerCategoriesDto } from './dto/update-worker-categories.dto';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { DispatchWorkOrderDto } from './dto/dispatch-work-order.dto';
import { CompleteWorkOrderDto } from './dto/complete-work-order.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { WorkOrderStatus } from './entities/work-order.entity';


@Controller()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}



  // @Get('categories')
  // listCategories() {
  //   return this.staffService.findAllCategories();
  // }

  // @Post('categories')
  // createCategory(@Body() dto: CreateCategoryDto) {
  //   return this.staffService.createCategory(dto);
  // }

  // @Delete('categories/:id')
  // deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.staffService.deleteCategory(id);
  // }

  // // ----- Workers -----

  // @Get('workers')
  // listWorkers(@Query('categoryId') categoryId?: string) {
  //   return this.staffService.findAllWorkers(categoryId);
  // }

  // @Post('workers')
  // createWorker(@Body() dto: CreateWorkerDto) {
  //   return this.staffService.createWorker(dto);
  // }

  // @Patch('workers/:id')
  // updateWorker(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateWorkerDto,
  // ) {
  //   return this.staffService.updateWorker(id, dto);
  // }

  // @Get('workers/:id/categories')
  // getWorkerCategories(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.staffService.getWorkerCategories(id);
  // }

  // @Put('workers/:id/categories')
  // setWorkerCategories(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateWorkerCategoriesDto,
  // ) {
  //   return this.staffService.setWorkerCategories(id, dto);
  // }

  // @Delete('workers/:id/categories/:categoryId')
  // removeWorkerCategory(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Param('categoryId', ParseUUIDPipe) categoryId: string,
  // ) {
  //   return this.staffService.removeWorkerCategory(id, categoryId);
  // }

  // @Delete('workers/:id')
  // deleteWorker(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.staffService.deleteWorker(id);
  // }

  // // ----- Work orders -----
  // // NOTE: 'work-orders/summary' is declared before 'work-orders/:id' on
  // // purpose. Route order matters — if :id came first, a request for
  // // /work-orders/summary would get matched as :id="summary" and blow up
  // // in the uuid pipe instead of reaching the summary handler.

  // @Post('work-orders')
  // createWorkOrder(@Body() dto: CreateWorkOrderDto) {
  //   return this.staffService.createWorkOrder(dto);
  // }

  // @Get('work-orders')
  // listWorkOrders(
  //   @Query('status', ParseWorkOrderStatusPipe) status?: WorkOrderStatus,
  //   @Query('assignedStaffId') assignedStaffId?: string,
  // ) {
  //   return this.staffService.findWorkOrders(status, assignedStaffId);
  // }

  // @Get('work-orders/summary')
  // getStaffSummary(@Query('staffId') staffId?: string) {
  //   // TODO once auth exists: replace this query param with @CurrentUser().id
  //   // and drop the manual check below.
  //   if (!staffId) {
  //     throw new BadRequestException(
  //       'staffId query param is required until auth is wired in',
  //     );
  //   }
  //   return this.staffService.getStaffSummary(staffId);
  // }

  // @Get('work-orders/:id')
  // getWorkOrder(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.staffService.findWorkOrderById(id);
  // }

  // @Patch('work-orders/:id/dispatch')
  // dispatchWorkOrder(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: DispatchWorkOrderDto,
  // ) {
  //   return this.staffService.dispatchWorkOrder(id, dto);
  // }

  // @Patch('work-orders/:id/confirm')
  // confirmWorkOrder(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.staffService.confirmWorkOrder(id);
  // }

  // @Patch('work-orders/:id/complete')
  // completeWorkOrder(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: CompleteWorkOrderDto,
  // ) {
  //   return this.staffService.completeWorkOrder(id, dto);
  // }

  // // ----- Reviews -----

  // @Post('work-orders/:id/review')
  // createReview(
  //   @Param('id', ParseUUIDPipe) workOrderId: string,
  //   @Body() dto: CreateReviewDto,
  // ) {
  //   return this.staffService.createReview(workOrderId, dto);
  // }

  // @Get('work-orders/:id/review')
  // getReview(@Param('id', ParseUUIDPipe) workOrderId: string) {
  //   return this.staffService.getReviewForWorkOrder(workOrderId);
  // }

  // @Patch('reviews/:id')
  // updateReview(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() dto: UpdateReviewDto,
  // ) {
  //   return this.staffService.updateReview(id, dto);
  // }
}
