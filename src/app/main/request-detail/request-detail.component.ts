import { OverlayRef } from '@angular/cdk/overlay';
import { Component } from '@angular/core';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.less']
})
export class RequestDetailComponent {


  constructor(private overlayRef: OverlayRef) {}

  closeOverlay() {
    this.overlayRef.dispose();
  }

}
