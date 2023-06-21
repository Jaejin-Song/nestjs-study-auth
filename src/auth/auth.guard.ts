import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.cookies['login']) {
      return true;
    }

    if (!request.body.email || !request.body.password) {
      return false;
    }

    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    if (!user) {
      return false;
    }

    request.user = user;
    return true;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: any): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
