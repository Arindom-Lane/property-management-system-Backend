import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAnnouncementDto {

    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsNotEmpty()
    body: string;
}
