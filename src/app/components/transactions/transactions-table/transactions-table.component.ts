import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { State } from 'src/app/state';
import { Store } from '@ngrx/store';
import { OverlayService } from '../../shared/modal/services/overlay.service';
import { TemplateService } from '../../shared/modal/services/template.service';
import { selectTxs } from 'src/app/state/txs/txs.reducers';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent implements OnInit {
  dataSource$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  columns = [
    { def: 'hash', accessor: (attr) => `${attr.hash.slice(0, 15)}...` }, 
    { def: 'type', accessor: (attr) => attr.action[0] }, 
    { def: 'height'}, 
    { def: 'time', accessor: (attr) => formatDate(attr.time, 'short','en-US') },
  ];

  constructor(
    private appStore: Store<State>,
    private overlayService: OverlayService,
    private templateService: TemplateService
  ) { 
  }

  ngOnInit() {
    this.appStore
    .select(selectTxs)
    .subscribe((txs:any) => {
      this.dataSource$.next(txs);
    });
  }

  onTxClick(tx) {
    this.overlayService.openModal(
      this.templateService.getTransactionTemplate(tx)
    );
  }
}