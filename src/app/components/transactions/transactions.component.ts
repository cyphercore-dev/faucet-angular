import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { BehaviorSubject } from 'rxjs';
import { selectTxs } from 'src/app/state/txs/txs.reducers';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  dataSource$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  columns = [
    { def: 'hash', accessor: (attr) => `${attr.hash.slice(0, 15)}...` }, 
    { def: 'type', accessor: (attr) => attr.action[0] }, 
    { def: 'height'}, 
    { def: 'time', accessor: (attr) => formatDate(attr.time, 'short','en-US') },
  ];

  constructor(
    private appStore: Store<State>
  ) { 
  }

  ngOnInit() {
    this.appStore
    .select(selectTxs)
    .subscribe((txs:any) => {
      this.dataSource$.next(txs);
    });
  }

}