import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphaNumValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.match(/[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/) ? { error: 'Podany kod zawiera nieprawidłowe znaki.' } : null;
  };
}