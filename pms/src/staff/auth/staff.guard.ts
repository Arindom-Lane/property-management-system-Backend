import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccountType } from '../../auth/dto/login.dto';
import { JwtPayload } from '../../auth/auth.service';

@Injectable()
export class StaffOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload | undefined;

    if (!user || user.accountType !== AccountType.STAFF) {
      throw new ForbiddenException('Only staff can access this resource');
    }

    return true;
  }
}