import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectConsensusHeight } from 'src/app/state/consensus/consensus.reducers';
import { map, skipWhile, first } from "rxjs/operators";
import { HttpService } from 'src/app/services/http.service';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';

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
  displayedColumns: string[] = ['height', 'hash', 'proposer', 'txs'];
  dataSource: BlocksDataSource;

  constructor(
    private appStore: Store<State>,
    // private httpService: HttpService
  ) { }

  ngOnInit() { 
    // TOFIX watch for unsubscribe bug
    this.appStore.select(selectBlocks).subscribe((blocks:any) => {
      this.dataSource = new BlocksDataSource(blocks);
      // console.log(blocks);
    });
  }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class BlocksDataSource extends DataSource<Block> {
  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<Block[]>;

  constructor(dataSource) {
    super();
    this.data = new BehaviorSubject<Block[]>(dataSource);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Block[]> {
    return this.data;
  }

  disconnect() {}
}