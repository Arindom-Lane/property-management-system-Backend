import { IsOptional, MaxLength } from 'class-validator';

export class UpdateAnnouncementDto {

    @IsOptional()
    @MaxLength(150)
    title?: string;

    @IsOptional()
    body?: string;

}
