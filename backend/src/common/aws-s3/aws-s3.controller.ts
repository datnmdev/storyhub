import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../constants/user.constants';
import { RolesGuard } from '../guards/roles.guard';
import { User } from '../decorators/user.decorator';
import { v4 as uuidV4 } from 'uuid';
import { GetUploadUrlDto } from './dtos/get-upload-url.dto';
import { AwsS3Service } from './aws-s3.service';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Get('generate-upload-url')
  @Roles(Role.READER, Role.AUTHOR)
  @UseGuards(RolesGuard)
  async generateUploadUrl(
    @User('id') userId: number,
    @Query() getUploadUrlDto: GetUploadUrlDto
  ) {
    const fileKey = `uploads/${userId}/${uuidV4()}.${getUploadUrlDto.fileType.split('/')[1]}`;
    const preUploadUrl = await this.awsS3Service.generateUploadUrl(
      fileKey,
      getUploadUrlDto.fileType
    );
    return {
      preUploadUrl,
      fileKey,
    };
  }
}
