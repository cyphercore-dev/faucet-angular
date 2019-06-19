import { Component, Inject, InjectionToken, Directive, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit, Input } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

@Directive({
  selector: '[templateHost]',
})
export class TemplateDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

export class ModalOverlayRef {
  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.overlayRef.dispose();
  }
}

export const MODAL_TEMPLATE = new InjectionToken<any>('MODAL_TEMPLATE');

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  @ViewChild(TemplateDirective) 
  templateHost: TemplateDirective;

  constructor(
    public modalRef: ModalOverlayRef,
    @Inject(MODAL_TEMPLATE) public template: any,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  
  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.template.component);
    const viewContainerRef = this.templateHost.viewContainerRef;

    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<any>componentRef.instance).data = this.template.data;
  }
}