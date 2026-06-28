import {
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  isEmail,
  contains,
  Contains,
  MinLength,
  Matches,
  IsIn,
  IsMobilePhone,
  min,
  Max,
  MaxLength,
  IsAlphanumeric,
  IsAlpha,
  Min,
} from "class-validator";

export class staffDataDto3 {
  @IsAlphanumeric()
  @IsAlpha()
  name?: string;

  @MinLength(6)
  @Matches(/[a-z]/)
  password?: string;

  @Matches(/^01[3-9]\d{8}$/)
  phone?: string;

  file?: string;
}
