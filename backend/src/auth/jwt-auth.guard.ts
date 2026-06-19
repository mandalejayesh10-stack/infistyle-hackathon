import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication credentials missing or invalid.');
    }
    if (user.isDisabled) {
      throw new UnauthorizedException('Account has been disabled. Access denied.');
    }
    return user;
  }
}
