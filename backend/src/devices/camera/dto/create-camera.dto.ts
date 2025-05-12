import { IsIP, IsInt, IsNotEmpty } from 'class-validator';

export class CreateCameraDto {
  @IsIP()
  ipAddress: string;

  @IsInt()
  @IsNotEmpty()
  inventoryId: number;
}
