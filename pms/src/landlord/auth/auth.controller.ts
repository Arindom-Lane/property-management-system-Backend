import{ Post, Body, HttpException, HttpStatus, Controller} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LandlordEntity} from '../entities/landlord.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
}