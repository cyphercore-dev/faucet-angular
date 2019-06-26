import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlocksComponent } from './components/blocks/blocks.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { LandingComponent } from './components/landing/landing.component';
import { FaucetComponent } from './components/faucet/faucet.component';

const routes: Routes = [
  { path: 'faucet', component: FaucetComponent },
  { path: 'dashboard', component: LandingComponent },
  { path: 'blocks', component: BlocksComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '**', redirectTo:'faucet' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
