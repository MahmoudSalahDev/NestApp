/* eslint-disable */
import { Body, Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { S3Service } from './service/s3.service';
import type { Request, Response, NextFunction } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service

  ) { }

  @Get()
  // @HttpCode(404)
  getHello(@Body() body: object): string {
    console.log(body);

    return this.appService.getHello();
  }

  @Get("/upload/*path")
  async GetFile(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    const { path } = req.params as unknown as { path: string[] }
    const Key = path.join("/")
    const result = await this.s3Service.getFile({ Key });
    const stream = result.Body as NodeJS.ReadableStream
    res.set("cross-origin-resource-policy", "cross-origin")
    res.setHeader("Content-Type", result?.ContentType!)
    stream.pipe(res)
  }





}
