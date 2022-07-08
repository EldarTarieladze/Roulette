import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { betType } from '../enum/betType.enum';
import { gameMode } from '../enum/gameMode.enum';

@ValidatorConstraint({ async: false })
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (text === betType.ODD) {
      return true;
    } else if (text === betType.EVEN) {
      return true;
    } else {
      // check if number between 0-36
      return /^[1-9]$|^[1-2][0-9]$|^3[0-6]$/.test(text);
    }
  }
  defaultMessage(args: ValidationArguments) {
    return 'betType must be one of the following values: 0-36 numbers, "odd", "even"';
  }
}

export class CreateSessionDto {
  @ApiProperty()
  @IsIn([gameMode.NORMAL, gameMode.TESTING])
  @IsString()
  @IsNotEmpty()
  gameMode: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  balance: number;
}

export class betInfoDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  betAmount: number;

  @ApiProperty({
    anyOf: [{ type: 'string' }, { type: 'number' }],
  })
  @Validate(CustomTextLength)
  betType: number | string;
}

export class SpinDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  winningNumber: number;

  @ApiProperty({ isArray: true, type: betInfoDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => betInfoDto)
  betInfo: betInfoDto[];
}
