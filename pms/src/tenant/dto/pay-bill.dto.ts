import { IsNumber } from 'class-validator';

export class PayBillDto {
  @IsNumber()
  billId: number;
}