// src/devices/printer/dto/create-printer.dto.ts
import { IsIP, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePrinterDto {
  @IsIP()
  ipAddress: string;

  @IsInt()
  inventoryId: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
