import {
  Controller,
  Get,
  Next,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { UrlCipherService } from '@/common/url-cipher/url-cipher.service';
import { NextFunction, Response } from 'express';
import { GetDataDto } from './dto/get-data.dto';
import { plainToInstance } from 'class-transformer';
import { EncryptedUrl } from '@/common/url-cipher/url-cipher.class';
import { UrlPrefix } from '@/common/constants/url-resolver.constants';
import { GoogleStorageService } from '@/common/google-storage/google-storage.service';
import axios from 'axios';

@Controller('url-resolver')
export class UrlResolverController {
  constructor(
    private readonly urlCipherService: UrlCipherService,
    private readonly googleStorageService: GoogleStorageService
  ) {}

  @Get()
  async getData(
    @Query() getDataDto: GetDataDto,
    @Res() res: Response,
    @Next() next: NextFunction
  ) {
    const payload = this.urlCipherService.decode(
      plainToInstance(EncryptedUrl, getDataDto)
    );
    let response: any;
    if (payload.url.startsWith(UrlPrefix.EXTERNAL_TRUYENQQ)) {
      response = await axios({
        url: payload.url.substring(UrlPrefix.EXTERNAL_TRUYENQQ.length),
        method: 'get',
        headers: {
          Referer: 'https://truyenqqviet.com/',
        },
        responseType: 'stream',
      });
    } else if (payload.url.startsWith(UrlPrefix.EXTERNAL_TRUYENFULL)) {
      response = await axios({
        url: payload.url.substring(UrlPrefix.EXTERNAL_TRUYENFULL.length),
        method: 'get',
        responseType: 'stream',
      });
    } else if (payload.url.startsWith(UrlPrefix.EXTERNAL_GOOGLE)) {
      response = await axios({
        url: payload.url.substring(UrlPrefix.EXTERNAL_GOOGLE.length),
        method: 'get',
        responseType: 'stream',
      });
    } else if (payload.url.startsWith(UrlPrefix.INTERNAL_GOOGLE_STORAGE)) {
      response = await axios({
        url: await this.googleStorageService.generateSignedUrl(
          payload.url.substring(UrlPrefix.INTERNAL_GOOGLE_STORAGE.length)
        ),
        method: 'get',
        responseType: 'stream',
      });
    } else {
      return next(new NotFoundException());
    }
    res.setHeader('Content-Type', response.headers['content-type']);
    return response.data.pipe(res);
  }
}
