import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Category } from './entities/category.entity';
import { Worker } from './entities/worker.entity';
import { WorkerCategory } from './entities/worker-category.entity';
import { WorkOrder, WorkOrderStatus } from './entities/work-order.entity';
import { Review } from './entities/review.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { UpdateWorkerCategoriesDto } from './dto/update-worker-categories.dto';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { DispatchWorkOrderDto } from './dto/dispatch-work-order.dto';
import { CompleteWorkOrderDto } from './dto/complete-work-order.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class StaffService {
  
}
