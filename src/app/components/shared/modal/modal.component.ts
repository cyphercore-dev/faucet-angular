import { Component, Inject, InjectionToken } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

export class ModalOverlayRef {
  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}

export const MODAL_DATA = new InjectionToken<any>('MODAL_DATA');

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent {
  constructor(
    public modalRef: ModalOverlayRef,
    @Inject(MODAL_DATA) public data: any
  ) { }
}