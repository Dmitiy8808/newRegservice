import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

// export const atLeastOneFieldValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//   if (control instanceof FormGroup) {
//     const fields = Object.values(control.controls);
//     if (fields.every(field => !field.value || field.value.trim() === '')) {
//       return { atLeastOneRequired: true };
//     }
//   }
//   return null;
// };

export const atLeastOneFieldValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  console.log(control); // Debug: Inspect the control object
  return null;
};

