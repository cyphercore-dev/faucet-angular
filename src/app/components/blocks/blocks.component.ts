import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';
import { OverlayService } from '../shared/modal/services/overlay.service';
import { TemplateService } from '../shared/modal/services/template.service';

export interface Block {
  hash: string;
  height: string;
  proposer: string;
  time: string;
  txs: string;
}

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent implements OnInit {
  dataSource$: BehaviorSubject<Block[]> = new BehaviorSubject<Block[]>([]);
  columns = [
    { def: 'height' },
    { def: 'hash', accessor: (attr) => `${attr.hash.slice(0, 15)}...` },  
    { def: 'proposer', accessor: (attr) => `${attr.proposer.slice(0, 15)}...` }, 
    { def: 'txs'},
  ];

  constructor(
    private appStore: Store<State>,
    private overlayService: OverlayService,
    private templateService: TemplateService
  ) { }

  ngOnInit() { 
    this.appStore
    .select(selectBlocks)
    .subscribe((blocks:any) => {
      this.dataSource$.next(blocks);
    });
  }

  onBlockClick(block) {
    this.overlayService.openModal(
      this.templateService.getBlockTemplate(block)
    );
  }
}
