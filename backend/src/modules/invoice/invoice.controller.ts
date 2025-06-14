import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { User } from '@/common/decorators/user.decorator';
import { InvoiceService } from './invoice.service';
import { Role } from '@/common/constants/user.constants';
import { GetInvoiceDto } from './dtos/get-invoice.dto';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  getInvoice(
    @User('id') userId: number,
    @Query() getInvoiceDto: GetInvoiceDto
  ) {
    return this.invoiceService.getInvoice(userId, getInvoiceDto);
  }

  @Post()
  @Roles(Role.READER)
  @UseGuards(RolesGuard)
  createInvoice(
    @User('id') userId: number,
    @Body() createInvoiceDto: CreateInvoiceDto
  ) {
    return this.invoiceService.createInvoiceBy(
      userId,
      createInvoiceDto.chapterId
    );
  }
}
