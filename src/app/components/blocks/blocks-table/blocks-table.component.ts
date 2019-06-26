import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { State } from 'src/app/state';
import { Store } from '@ngrx/store';
import { OverlayService } from '../../shared/modal/services/overlay.service';
import { TemplateService } from '../../shared/modal/services/template.service';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';

export interface Block {
  hash: string;
  height: string;
  proposer: string;
  time: string;
  txs: string;
}

@Component({
  selector: 'app-blocks-table',
  templateUrl: './blocks-table.component.html',
  styleUrls: ['./blocks-table.component.scss']
})
export class BlocksTableComponent implements OnInit {
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
