import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphaNumValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.match(/[^a-zA-Z0-9]/) ? { error: 'Podany kod zawiera nieprawidłowe znaki.' } : null;
  };
}