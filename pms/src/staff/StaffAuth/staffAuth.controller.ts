import { Body, Controller, Post,HttpStatus,HttpCode } from '@nestjs/common';
import { authLoginDTO } from './dto/authLogin.dto';
import { staffAuthService } from './staffAuth.service';

@Controller('auth')
export class staffAuthController {
constructor(private readonly authService:staffAuthService){}

@HttpCode(HttpStatus.OK)
@Post('login')
logIn(@Body() body: authLoginDTO){
    return this.authService.logIn(body.email, body.password);
}


}
