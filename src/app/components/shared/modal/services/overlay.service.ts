import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ModalOverlayRef, ModalComponent, MODAL_TEMPLATE } from '../modal.component';

export interface ModalConfig {
  hasBackdrop?: boolean;
  template? :any;
}

export const DEFAULT_CONFIG: ModalConfig = {
  hasBackdrop: true,
  template: null,
}

@Injectable({
  providedIn: 'root'
})

export class OverlayService {
  constructor(
    private injector: Injector,
    private overlay: Overlay
  ) { }

  private open(config: ModalConfig = {}) {
    const modalConfig = { ...DEFAULT_CONFIG, ...config };

    const overlayRef = this.createOverlay(modalConfig);

    const modalRef = new ModalOverlayRef(overlayRef);
    const overlayComponent = this.attachDialogContainer(overlayRef, modalConfig, modalRef);

    overlayRef.backdropClick().subscribe(_ => modalRef.close());

    return modalRef;
  }

  public openModal(template) {
    let modalRef: ModalOverlayRef = this.open({
      template
    });
  }

  private createOverlay(config: ModalConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ModalConfig, modalRef: ModalOverlayRef) {
    const injector = this.createInjector(config, modalRef);

    const containerPortal = new ComponentPortal(ModalComponent, null, injector);
    const containerRef: ComponentRef<ModalComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: ModalConfig, modalRef: ModalOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ModalOverlayRef, modalRef);
    injectionTokens.set(MODAL_TEMPLATE, config.template);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: ModalConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
      height: 'auto',
      width: 'auto',
    });

    return overlayConfig;
  }
}