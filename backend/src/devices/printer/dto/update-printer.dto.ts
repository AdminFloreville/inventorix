// src/devices/printer/dto/update-printer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePrinterDto } from './create-printer.dto';

export class UpdatePrinterDto extends PartialType(CreatePrinterDto) {}
