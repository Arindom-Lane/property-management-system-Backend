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
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { StaffService } from "./staff.service";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { CompleteWorkOrderDto } from "./dto/complete-work-order.dto";
import { DispatchWorkOrderDto } from "./dto/dispatch-work-order.dto";
import { CreateWorkOrderDto } from "./dto/create-work-oder.dto";
import { staffDto } from "./dto/staff.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('createStaff')
  @UsePipes(new ValidationPipe)
  createStaff(@Body() dto: staffDto){
    return this.staffService.createStaff(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('viewAllStaff')
  viewAllStaff(){
    return this.staffService.viewAllStaff();
  }

  @Post("loginStaff")
  @UsePipes(new ValidationPipe)
  loginStaff(@Body() dto: staffDto){
    return this.staffService.loginStaff(dto);
  }
  
  // @Post("findStaff/:id")
  // findStaff(@Param("id", ParseIntPipe) id: number,){
  //   return this.staffService.findStaff(id);
  // }

  @Post("workers")
  @UsePipes(new ValidationPipe())
  createWorker(@Body() dto: CreateWorkerDto) {
    return this.staffService.createWorker(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("workers")
  findAllWorkers() {
    return this.staffService.findAllWorkers();
  }

  @Patch("workers/:id")
  @UsePipes(new ValidationPipe())
  updateWorkerName(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateWorkerDto,
  ) {
    return this.staffService.updateWorkerName(id, dto);
  }

  @Delete("workers/:id")
  deleteWorker(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }

  @Get("work-orders")
  findAllWorkOrders() {
    return this.staffService.findAllWorkOrders();
  }

  @Post("work-orders")
  @UsePipes(new ValidationPipe())
  createWorkOrder(@Body() dto: CreateWorkOrderDto) {
    return this.staffService.createWorkOrder(dto);
  }

  @Patch("work-orders/:id/dispatch")
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: DispatchWorkOrderDto,
  ) {
    return this.staffService.dispatchWorker(id, dto);
  }

  @Patch("work-orders/:id/remove-worker")
  @UsePipes(new ValidationPipe())
  removeWorkerFromOrder(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @Patch("work-orders/:id/complete")
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @Delete("work-orders/:id")
  deleteOrder(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  @Get("landloards")
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  
  @Get("work-orders/:id/review")
  getReviewByOrder(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }
}
