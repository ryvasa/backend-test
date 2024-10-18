import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  Patch,
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
import { UpdateUrlDto } from './dto/update-url.dto';

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
    return this.urlService.create(req.user, createUrlDto, req);
  }

  @ApiOperation({ summary: 'Find a shorted url' })
  @ApiResponse({ status: 200, description: 'Url is found successfully.' })
  @Get(':back_half_url')
  async findOne(
    @Param('back_half_url') shortedUrl: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.findOne(shortedUrl);
    return res.status(301).redirect(url);
  }

  @ApiOperation({ summary: 'Update url' })
  @ApiResponse({ status: 200, description: 'Url is updated successfully.' })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Patch(':back_half_url')
  async update(
    @Body() updateUrlDto: UpdateUrlDto,
    @Req() req: any,
    @Param('back_half_url') shortedUrl: string,
  ): Promise<UrlResponse> {
    return this.urlService.updateShortLink({
      user: req.user,
      updateUrlDto,
      req,
      shortedUrl,
    });
  }
}
