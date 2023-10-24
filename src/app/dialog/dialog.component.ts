import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent {
  @Input() visible: boolean = false;
  @Output() closeEvent: EventEmitter<void> = new EventEmitter<void>();

  close(): void {
    this.closeEvent.emit();
  }
  
}
