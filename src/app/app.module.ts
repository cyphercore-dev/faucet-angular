import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers } from './state';
import { BlocksComponent } from './components/blocks/blocks.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CdkModule } from './cdk.module';

@NgModule({
  declarations: [
    AppComponent,
    BlocksComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    CdkModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    [
      StoreModule.forRoot(reducers)
    ],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
