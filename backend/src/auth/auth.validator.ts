import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isDniValid', async: false })
@Injectable()
export class IsDniValidConstraint implements ValidatorConstraintInterface {
  validate(dni: string, args: ValidationArguments) {
    const dniNumber = parseInt(dni, 10);
    return !isNaN(dniNumber) && dniNumber >= 1000000 && dniNumber <= 99999999;
  }

  defaultMessage(args: ValidationArguments) {
    return 'DNI must be a number between 1000000 and 99999999';
  }
}
