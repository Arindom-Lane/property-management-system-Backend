import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

// Body for PUT /workers/:id/categories — replaces the worker's ENTIRE
// specialty list with exactly this set of category ids.
export class UpdateWorkerCategoriesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  categoryIds: string[];
}
