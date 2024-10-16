import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    type: 'string',
    example: 'https://google.com/aswqe_wqw32_q3rw=2',
  })
  @IsUrl({})
  original_url: string;

  @ApiProperty({
    type: 'string',
    example: 'google123',
    maxLength: 16,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(16, { message: 'Custom URL must not exceed 16 characters' })
  custom_url?: string;
}
