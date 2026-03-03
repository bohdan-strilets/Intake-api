import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

function isIANATimeZone(value: string): boolean {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

@ValidatorConstraint({ name: 'IsIANATimeZone', async: false })
export class IsIANATimeZoneConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, _args: ValidationArguments): boolean {
    return typeof value === 'string' && isIANATimeZone(value);
  }

  defaultMessage(): string {
    return 'timezone must be a valid IANA time zone string';
  }
}

export function IsIANATimeZone(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsIANATimeZoneConstraint,
    });
  };
}
