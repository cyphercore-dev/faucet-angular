import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';
import { skipWhile, first, filter } from 'rxjs/operators';
import { from, BehaviorSubject, Observable } from 'rxjs';
import { selectTxs } from 'src/app/state/txs/txs.reducers';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  displayedColumns: string[] = ['hash', 'type', 'height', 'time'];
  dataSource: TransactionsDataSource;

  constructor(
    private appStore: Store<State>,
    // private httpService: HttpService,
  ) { }

  ngOnInit() {
    this.appStore
    .select(selectTxs)
    .subscribe((txs:any) => {
      // console.log(txs);
      this.dataSource = new TransactionsDataSource(txs);
    });
  }
}

export class TransactionsDataSource extends DataSource<any> {
  data: BehaviorSubject<any[]>;

  constructor(dataSource) {
    super();
    this.data = new BehaviorSubject<any[]>(dataSource);
  }

  connect(): Observable<any[]> {
    return this.data;
  }

  disconnect() {}
}