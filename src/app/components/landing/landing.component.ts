import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';
import { selectTxs } from 'src/app/state/txs/txs.reducers';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  cards = [
    { title: 'blocks', size: this.appStore.select(selectBlocks) },
    { title: 'transactions', size: this.appStore.select(selectTxs) }
  ]

  constructor(
    private appStore: Store<State>
  ) { }

  ngOnInit() {
  }

}
