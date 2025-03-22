import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DepositeTransactionService } from './deposite-transaction.service';
import { CreatePaymentUrlDto } from './dto/create-payment-url.dto';
import { Request, Response } from 'express';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/constants/user.constants';
import { HandleVnpayIpnDto } from './dto/handle-vnpay-ipn.dto';

@Controller('deposite-transaction')
export class DepositeTransactionController {
  constructor(
    private readonly depositeTransactionService: DepositeTransactionService
  ) {}

  @Post('create-payment-url')
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  createPaymentUrl(
    @Req() req: Request,
    @Body() createPaymentUrlDto: CreatePaymentUrlDto
  ) {
    return this.depositeTransactionService.createPaymentUrl(
      req,
      createPaymentUrlDto
    );
  }

  @Get('vnpay-ipn')
  handleVnpayIpn(
    @Query() handleVnpayIpnDto: HandleVnpayIpnDto,
    @Res() res: Response
  ) {
    return res
      .status(200)
      .json(this.depositeTransactionService.handleVnpIpn(handleVnpayIpnDto));
  }

  @Get('vnpay-return')
  handleVnpayReturn(@Query() handleVnpayReturnDto: HandleVnpayIpnDto,) {
    return this.depositeTransactionService.handleVnpReturn(handleVnpayReturnDto);
  }
}
