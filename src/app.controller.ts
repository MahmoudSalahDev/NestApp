import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @HttpCode(404)
  getHello(@Body() body: object): string {
    console.log(body);

    return this.appService.getHello();
  }
}
