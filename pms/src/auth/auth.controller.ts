import { Body, Controller, Post,HttpStatus,HttpCode } from '@nestjs/common';
import { authLoginDTO } from './dto/authLogin.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
constructor(private readonly authService:AuthService){}

@HttpCode(HttpStatus.OK)
@Post('login')
logIn(@Body() body: authLoginDTO){
    return this.authService.logIn(body.email, body.password);
}


}
