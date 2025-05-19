import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateInventoryPartDto {
  @IsString()
  name: string;

  @IsString()
  serialNumber: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isWrittenOff: boolean;

  @IsString()
  user: string;
}
