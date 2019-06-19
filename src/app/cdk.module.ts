import { NgModule } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    CdkTableModule,
    OverlayModule,
    PortalModule
  ],
  exports: [
    CdkTableModule,
    OverlayModule,
    PortalModule
  ]
}) 
export class CdkModule { }