import { Component, Input, SimpleChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.less']
})
export class InputComponent {

  @Input() inputType: 'search' | 'normal' = 'normal';
  @Input() placeholder: string = '';
  @Input() maskType: 'inn' | 'kpp' | 'none'= 'none';
  @Input() isRequired: boolean = false;
  inputText: string = '';



  constructor () {

  }


  clearSearch(): void {
    this.inputText = '';
  }






}
