import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlocksComponent } from './components/blocks/blocks.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

const routes: Routes = [
  { path: 'blocks', component: BlocksComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '**', redirectTo:'/blocks' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
