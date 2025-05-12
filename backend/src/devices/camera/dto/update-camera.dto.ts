import { IsIP, IsInt, IsOptional } from 'class-validator';

export class UpdateCameraDto {
  @IsIP()
  @IsOptional()
  ipAddress?: string;

  @IsInt()
  @IsOptional()
  inventoryId?: number;
}
