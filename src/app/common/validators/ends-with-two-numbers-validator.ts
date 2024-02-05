import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function endsWithTwoNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.slice(-2).match(/^\d+$/) ?  null : { error: 'Podany kod jest nieprawidłowy.' };
  };
}