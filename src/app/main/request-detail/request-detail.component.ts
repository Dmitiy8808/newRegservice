import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DadataService } from 'src/app/services/dadata.service';
import { RequestService } from 'src/app/services/request.service';



@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.less']
})
export class RequestDetailComponent implements OnInit {

  // suggestions: any[] = [];
  highlightedIndex: number = -1;
  idCenterForms: { formGroup: FormGroup, suggestions: any[] }[] = [];
  partnerForm!: FormGroup;
  showRoleOptions: boolean = false;
  roleOptions: string[] = ['Администратор', 'Партнер', 'Дистрибьютор'];
  certificateFile: File | null = null;



  constructor(private overlayRef: OverlayRef, private requestService: RequestService,
      private formBuilder: FormBuilder, private dadataService: DadataService) { }


  ngOnInit(): void {
    this.partnerForm = new FormGroup({
      "Name": new FormControl(null),
      "Inn": new FormControl(null, [Validators.required, this.innValidator()]),
      "Kpp": new FormControl(null, [Validators.required, this.kppValidator()]),
      "Email": new FormControl(null),
      "IsIdentificationCenter": new FormControl(null),
      "FirstName": new FormControl(null),
      "LastName": new FormControl(null),
      "Patronymic": new FormControl(null),
      "Snils": new FormControl(null, [Validators.required, this.snilsValidator()]),
      "Login": new FormControl(null),
      "Password": new FormControl(null),
      "IsDisabled": new FormControl(null),
      "Role": new FormControl(null),
      "IsHasLicence": new FormControl(null),
    });

    this.partnerForm.get('Inn')!.valueChanges.subscribe(value => {
      this.checkValidityAndFetchName();
    });
    this.partnerForm.get('Kpp')!.valueChanges.subscribe(value => {
      this.checkValidityAndFetchName();
    });
    this.partnerForm.get('Snils')!.valueChanges.subscribe(value => {
      this.checkValidityAndFetchPerson();
    });

  }

  get name() { return this.partnerForm.get('Name'); }
  get inn() { return this.partnerForm.get('Inn'); }
  get kpp() { return this.partnerForm.get('Kpp'); }
  get snils() { return this.partnerForm.get('Snils'); }
  get lastName() { return this.partnerForm.get('LastName'); }
  get firstName() { return this.partnerForm.get('FirstName'); }
  get patronymic() { return this.partnerForm.get('Patronymic'); }
  get email() { return this.partnerForm.get('Email'); }
  get login() { return this.partnerForm.get('Login'); }
  get password() { return this.partnerForm.get('Password'); }

  savePartner(): void {
    console.log(this.partnerForm.value);
  }

  clearSearch(controlName: string): void {
    this.partnerForm.get(controlName)?.reset();
  }

  clearSpecificControl(formIndex: number, controlName: string): void {
    this.idCenterForms[formIndex].suggestions = [];
    this.highlightedIndex = -1;
    if (formIndex >= 0 && formIndex< this.idCenterForms.length) {
      const formGroup = this.idCenterForms[formIndex].formGroup;
      formGroup.get(controlName)?.reset();;
    }
  }

  // Validators
  innValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inn = control.value;
      if (inn === null) {
        return null;
      }
      if (inn && /^[0-9]+$/.test(inn)) {
        if (inn.length === 10) {
          return this.validateInnLegalEntity(inn) ? null : { 'invalidInn': true };
        } else if (inn.length === 12) {
          return this.validateInnIndividual(inn) ? null : { 'invalidInn': true };
        }
      }
      return { 'invalidInn': true };
    };
  }

  validateInnLegalEntity(inn: string): boolean {
    const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    if (inn.length !== 10) {
      return false; // INN must be exactly 10 characters long
    }
    const controlSum = inn
      .slice(0, 9)
      .split('')
      .reduce((sum, digit, index) => sum + parseInt(digit, 10) * weights[index], 0);
    const controlDigit = controlSum % 11 % 10;
    return controlDigit === parseInt(inn[9], 10); // Compare calculated control digit with the last digit of INN
  }

  validateInnIndividual(inn: string): boolean {
    const weightsFirst = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const weightsSecond = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];

    if (inn.length !== 12) {
      return false; // INN must be exactly 12 characters long for an individual
    }

    // Calculate the first control digit
    const controlDigit1 = inn
      .slice(0, 10)
      .split('')
      .reduce((sum, digit, index) => sum + parseInt(digit, 10) * weightsFirst[index], 0) % 11 % 10;

    // Calculate the second control digit
    const controlDigit2 = inn
      .slice(0, 11)
      .split('')
      .reduce((sum, digit, index) => sum + parseInt(digit, 10) * weightsSecond[index], 0) % 11 % 10;

    return controlDigit1 === parseInt(inn[10], 10) && controlDigit2 === parseInt(inn[11], 10);
  }


  kppValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const kpp = control.value;
      if (kpp === null) {
        return null;
      }
      if (!/^[0-9]{4}[0-9A-Z]{2}[0-9]{3}$/.test(kpp)) {
        return { 'invalidKpp': true }
      }
      return null;
    };
  }


  snilsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      // Remove non-digits and check if the length is 11 (9 digits + 2 checksum)
      const snils = value.replace(/[^\d]/g, '');
      if (snils.length !== 11) {
        return { 'invalidSnils': true };
      }

      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(snils[i], 10) * (9 - i);
      }

      let checksum = 0;
      if (sum < 100) {
        checksum = sum;
      } else if (sum <= 101) {
        checksum = 0;
      } else {
        checksum = sum % 101;
        if (checksum === 100) {
          checksum = 0;
        }
      }

      const isSnilsValid = checksum === parseInt(snils.slice(-2), 10);

      return isSnilsValid ? null : { 'invalidSnils': true };
    };
  }

  formatSnils(snils: string): string {
    const snilsPattern = /(\d{3})(\d{3})(\d{3})(\d{2})/;
    return snils.replace(snilsPattern, '$1-$2-$3 $4');
  }

  closeOverlay() {
    this.overlayRef.dispose();
  }


  checkValidityAndFetchName() {
    if (this.partnerForm.get('Inn')!.valid && this.partnerForm.get('Kpp')!.valid) {
      const inn = this.partnerForm.get('Inn')!.value;
      const kpp = this.partnerForm.get('Kpp')!.value;
      this.requestService.getAgentInformation(inn, kpp).subscribe({
        next: (data) => {
          if (data && data.Name) {
            this.partnerForm.get('Name')!.setValue(data.Name);
          } else {
            // Handle the case where the response is null or the Name property is missing
            console.info('Received null or invalid data from GetAgentInformation:', data);
          }
        },
        error: (error) => {
          // Handle the error from the subscription
          console.error('API call failed:', error);
        }
      });
    }
  }


  checkValidityAndFetchPerson() {
    if (this.partnerForm.get('Snils')!.valid) {
      const snils = this.formatSnils(this.partnerForm.get('Snils')!.value);
      this.requestService.getPersonInformation(snils).subscribe({
        next: (data) => {
          if (data && data.FirstName) {
            this.partnerForm.get('FirstName')!.setValue(data.FirstName);
          }
          if (data && data.LastName) {
            this.partnerForm.get('LastName')!.setValue(data.LastName);
          }
          if (data && data.Patronymic) {
            this.partnerForm.get('Patronymic')!.setValue(data.Patronymic);
          }
          else {
            // Handle the case where the response is null or the Name property is missing
            console.info('Received null or invalid data from GetAgentInformation:', data);
          }
        },
        error: (error) => {
          // Handle the error from the subscription
          console.error('API call failed:', error);
        }
      });
    }
  }

  // dropdown menu
  toggleRoleDropdown(): void {
    this.showRoleOptions = !this.showRoleOptions ;
  }

  selectRoleOption(option: any): void {

    this.partnerForm.get('Role')?.setValue(option);
    this.showRoleOptions = false;
  }


//file upload
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    this.certificateFile = input.files[0];
    console.log('Selected file:', this.certificateFile);
    // Handle file selection logic here
  }
}

onFileDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer && event.dataTransfer.files.length) {
    this.certificateFile = event.dataTransfer.files[0];
    console.log('Dropped file:', this.certificateFile);
    // Handle file drop logic here
  }
}

onDragOver(event: DragEvent) {
  event.stopPropagation();
  event.preventDefault();
  // Add any visual cues for drag over
}

onDragLeave(event: DragEvent) {
  // Handle drag leave logic, if needed
}

deleteCertificateFile() {
  this.certificateFile = null;
}

addNewForm() {
  const form = this.formBuilder.group({
    name: '',
    Address: '',
    email: '',
    telephone: ''
  });

  const formWithSuggestions = {
    formGroup: form,
    suggestions: []
  };

  this.idCenterForms.push(formWithSuggestions);
}

// fetchSuggestions(event: Event) {
//   const input = event.target as HTMLInputElement;
//   const value = input.value;
//   if (value.length > 2) {
//     this.dadataService.getSuggestions(value).subscribe({
//       next: (data) => this.suggestions = data.suggestions,
//       error: (error) => console.error(error),
//       complete: () => console.log('Suggestions fetch completed')
//     });
//   }
// }

fetchSuggestions(event: Event, formIndex: number) {
  this.highlightedIndex = -1;
  const input = event.target as HTMLInputElement;
  const value = input.value;
  console.log('value' + value);
  if (value.length > 2) {
    this.dadataService.getSuggestions(value).subscribe({
            next: (data) => this.idCenterForms[formIndex].suggestions = data.suggestions,
            error: (error) => console.error(error),
            complete: () => console.log('Suggestions fetch completed')
          });
  }
}

setAddressValue(formIndex: number, suggestionValue: string) {
  const formGroup = this.idCenterForms[formIndex].formGroup;
  formGroup.get('Address')?.setValue(suggestionValue);
  this.idCenterForms[formIndex].suggestions = []; // Clear suggestions
}

handleKeyDown(event: KeyboardEvent, suggestions: any[], formIndex: number) {
  if (event.key === 'ArrowDown') {
    this.highlightedIndex = (this.highlightedIndex + 1) % suggestions.length;
  } else if (event.key === 'ArrowUp') {
    this.highlightedIndex = (this.highlightedIndex - 1 + suggestions.length) % suggestions.length;
  } else if (event.key === 'Enter') {
    if (this.highlightedIndex >= 0) {
      this.setAddressValue(formIndex, suggestions[this.highlightedIndex].value);
    }
  }

  // Prevent default scrolling behavior for arrow keys
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
  }
}






}
