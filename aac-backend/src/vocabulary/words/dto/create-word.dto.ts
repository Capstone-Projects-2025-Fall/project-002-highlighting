import { IsString, IsOptional, IsArray, IsNumber } from "class-validator";

export class CreateWordDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsNumber()
  userId?: number;
}