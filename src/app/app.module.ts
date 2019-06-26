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
import { LandingComponent } from './components/landing/landing.component';
import { ConsensusStatusComponent } from './components/consensus-status/consensus-status.component';
import { TableComponent } from './components/shared/table/table.component';
import { ModalComponent, TemplateDirective } from './components/shared/modal/modal.component';
import { BlockComponent } from './components/shared/modal/templates/block/block.component';
import { TransactionComponent } from './components/shared/modal/templates/transaction/transaction.component';
import { FaucetComponent } from './components/faucet/faucet.component';
import { BlocksTableComponent } from './components/blocks/blocks-table/blocks-table.component';
import { TransactionsTableComponent } from './components/transactions/transactions-table/transactions-table.component';

@NgModule({
  declarations: [
    AppComponent,
    BlocksComponent,
    TransactionsComponent,
    LandingComponent,
    ConsensusStatusComponent,
    TableComponent,
    ModalComponent,
    BlockComponent,
    TemplateDirective,
    TransactionComponent,
    FaucetComponent,
    BlocksTableComponent,
    TransactionsTableComponent
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
  entryComponents: [
    ModalComponent,
    BlockComponent,
    TransactionComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
