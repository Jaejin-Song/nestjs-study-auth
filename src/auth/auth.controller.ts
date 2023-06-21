import {
  Controller,
  Body,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { LoginGuard, AuthenticatedGuard, LocalAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.registr(userDto);
  }

  @Post('login')
  async login(@Request() req, @Response() res) {
    const userInfo = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    console.log(userInfo);

    if (userInfo) {
      res.cookie('login', JSON.stringify(userInfo), {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7day
      });
    }
    return res.send({ message: 'login success' });
  }

  @UseGuards(LoginGuard)
  @Post('login2')
  async login2(@Request() req, @Response() res) {
    console.log('req.cookies', req.cookies['login']);
    console.log('req.user', req.user);

    const userInfo = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );
    console.log('1', !req.cookies['login'], req.cookies['login']);
    console.log('2', userInfo);

    console.log(!req.cookies['login'] && userInfo);

    if (!req.cookies['login'] && userInfo) {
      res.cookie('login', JSON.stringify(userInfo), {
        httpOnly: true,
        maxAge: 1000 * 10, // 10 seconds
      });
      console.log('here');
    }
    return res.send({ message: 'login2 success' });
  }

  @UseGuards(LoginGuard)
  @Get('test-guard')
  testGuard() {
    return 'test guard success. now login status';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login3')
  login3(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('test-guard2')
  testGuardWithSession(@Request() req) {
    return req.user;
  }
}
