import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  injector: Injector | undefined;
  constructor(private overlay: Overlay) { }

  openOverlay(component: any): OverlayRef {
    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      disposeOnNavigation: true,
      // Apply width and height via the panelClass or in the overlayConfig
      positionStrategy: this.overlay.position().global().centerHorizontally().top('0'),
      width: '80%',
      height: '100%',
      panelClass: ['custom-overlay-class']
    });

    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: OverlayRef, useValue: overlayRef }]
    });

    const overlayComponentPortal = new ComponentPortal(component, null, injector);
  overlayRef.attach(overlayComponentPortal);

  return overlayRef;
  }
}
