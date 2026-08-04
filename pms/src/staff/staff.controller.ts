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

import { StaffService } from './staff.service';
import { staffDto } from "./dto/staff.dto";
import {CreateWorkOrderDto} from './dto/CreateWorkOrder.dto'
import {DispatchWorkerDto} from './dto/DispatchWorkOrder.dto'
import { CreateWorkerDto } from "./dto/CreateWorker.dto";

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

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
  deleteStaff(@Param('staffId') id: number){
    return this.staffService.deleteStaff(id);
  }

  

  /*
  @Post("loginStaff")
  @UsePipes(new ValidationPipe)
  loginStaff(@Body() dto: staffDto) {
    return this.staffService.loginStaff(dto);
  }

  // @Post("findStaff/:id")
  // findStaff(@Param("id", ParseIntPipe) id: number,){
  //   return this.staffService.findStaff(id);
  // }
*/
  @Post("/:staffId/workers")
  @UsePipes(new ValidationPipe())
  createWorker(@Body() dto: CreateWorkerDto,@Param('staffId') staffId: number) {
    return this.staffService.createWorker(staffId, dto);
  }
/*
  @UseGuards(JwtAuthGuard)
  @Get("workers")
  findAllWorkers() {
    return this.staffService.findAllWorkers();
  }
  @UseGuards(JwtAuthGuard)
  @Patch("workers/:id")
  @UsePipes(new ValidationPipe())
  updateWorkerName(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CreateWorkerDto,
  ) {
    return this.staffService.updateWorkerName(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("workers/:id")
  deleteWorker(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.deleteWorker(id);
  }
*/

  @Get("work-orders")
  findAllWorkOrders() {
    return this.staffService.findAllWorkOrders();
  }

  @Post("work-orders/:id")
  @UsePipes(new ValidationPipe())
  createWorkOrder(@Param('id') id:number,@Body() dto: CreateWorkOrderDto) {
    return this.staffService.createWorkOrder(id,dto);
  }

  @Patch("work-orders/:id/dispatch")
  @UsePipes(new ValidationPipe())
  dispatchWorker(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: DispatchWorkerDto
  ) {
    return this.staffService.dispatchWorker(id, body);
  }
/*
  @UseGuards(JwtAuthGuard)
  @Patch("work-orders/:id/remove-worker")
  @UsePipes(new ValidationPipe())
  removeWorkerFromOrder(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.removeWorkerFromOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("work-orders/:id/complete")
  @UsePipes(new ValidationPipe())
  completeWorkOrder(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CompleteWorkOrderDto,
  ) {
    return this.staffService.completeWorkOrder(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("work-orders/:id")
  deleteOrder(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.deleteOrder(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("landloards")
  getAllLandLoards() {
    return this.staffService.getAllLandLoards();
  }

  @UseGuards(JwtAuthGuard)
  @Get("work-orders/:id/review")
  getReviewByOrder(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.getReviewByOrder(id);
  }

  @Delete("deleteReview/:id")
  deleteReview(@Param("id", ParseIntPipe) id: number) {
    return this.staffService.deleteReview(id);
  }
    */
}
