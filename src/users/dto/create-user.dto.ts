import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com', type: 'string' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mypassword', type: 'string' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'john', type: 'string' })
  @IsNotEmpty()
  name: string;
}
