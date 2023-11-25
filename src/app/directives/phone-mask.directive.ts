import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = this.el.nativeElement;
    let inputNumbersValue = this.getInputNumbersValue(input);

    let formattedInputValue = "";
    if (!inputNumbersValue) {
      return input.value = "";
    }

    if (inputNumbersValue.length != input.selectionStart) {
      // Editing in the middle of input, not last symbol
      if (event.data && /\D/g.test(event.data)) {
        // Attempt to input non-numeric symbol
        input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
      const firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
      formattedInputValue = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    }
    input.value = formattedInputValue;
    return input.value;
  }

  @HostListener('paste', ['$event'])
onPaste(event: ClipboardEvent) {
    const input = this.el.nativeElement;
    const inputNumbersValue = this.getInputNumbersValue(input);

    // Use event.clipboardData directly
    const pasted = event.clipboardData;
    if (pasted) {
        const pastedText = pasted.getData('Text');
        if (/\D/g.test(pastedText)) {
            // Attempt to paste non-numeric symbol
            input.value = inputNumbersValue;
            event.preventDefault();
        }
    }
}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const inputValue = input.value.replace(/\D/g, '');
    if (event.key === 'Backspace' && inputValue.length === 1) {
      input.value = "";
    }
  }

  private getInputNumbersValue(input: any): string {
    return input.value.replace(/\D/g, '');
  }

}
