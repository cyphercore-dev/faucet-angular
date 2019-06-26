import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';
import { selectTxs } from 'src/app/state/txs/txs.reducers';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  blocksSize = 0;
  blocks$ =  this.appStore.select(selectBlocks).subscribe(blocks => this.blocksSize = blocks.length);

  cards = [
    { title: 'blocks', description: () => `Last ${this.blocksSize} blocks.` },
    { title: 'transactions', description: () => `Transactions on last ${this.blocksSize} blocks.` }
  ]

  constructor(
    private appStore: Store<State>
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.blocks$.unsubscribe();
  }

}
