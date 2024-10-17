import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { UrlResponse } from './interfaces/url-response.interface';

@ApiTags('Url')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({ summary: 'Create a shorted url' })
  @ApiResponse({ status: 201, description: 'Url is created successfully.' })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: any,
  ): Promise<UrlResponse> {
    return this.urlService.create(req.user, createUrlDto);
  }

  @ApiOperation({ summary: 'Find a shorted url' })
  @ApiResponse({ status: 200, description: 'Url is found successfully.' })
  @Get(':short_url')
  async findOne(
    @Param('short_url') short_url: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const url = await this.urlService.findOne(req, short_url);
    return res.status(301).redirect(url);
  }
}
