import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInnMask]'
})
export class InnMaskDirective {

  private regex: RegExp = new RegExp('^[0-9]*$');
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];
  @Input() appInnMask: string = 'none';

  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.appInnMask === 'none') {
      return; // No restriction
    }
    // Allow special keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && next.length > 10 || !String(event.key).match(this.regex)) {
      event.preventDefault();
    }
  }

}
