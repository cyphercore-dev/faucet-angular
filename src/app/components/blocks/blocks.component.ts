import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectBlocks } from 'src/app/state/blocks/blocks.reducers';
import { first } from 'rxjs/operators';

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

  tablePageSize = 10;
  tableActivePage = 0;
  tableMaxPage = 0;

  constructor(
    private appStore: Store<State>,
  ) { }

  ngOnInit() { 
    // TOFIX watch for unsubscribe bug
    this.appStore.select(selectBlocks).subscribe((blocks:any) => {
      this.tableMaxPage = Math.ceil(blocks.length / this.tablePageSize)-1;

      this.dataSource = new SlicedBlocksDataSource(
        blocks,
        this.tablePageSize,
        this.tableActivePage
      );
    });
  }

  onTableNextPage() {
    if(this.tableActivePage < this.tableMaxPage) {
      this.tableActivePage += 1;

      this.appStore.select(selectBlocks).pipe(first()).subscribe((blocks:any) => {
        this.dataSource = new SlicedBlocksDataSource(
          blocks,
          this.tablePageSize,
          this.tableActivePage
        );
      });
    }
  }

  onTablePrevPage() {
    if(this.tableActivePage > 0) {
      this.tableActivePage -= 1;

      this.appStore.select(selectBlocks).pipe(first()).subscribe((blocks:any) => {
        this.dataSource = new SlicedBlocksDataSource(
          blocks,
          this.tablePageSize,
          this.tableActivePage
        );
      });
    }
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

export class SlicedBlocksDataSource extends DataSource<Block> {
  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<Block[]>;

  constructor(dataSource, pageSize, activePage) {
    super();
    
    let startIndex = activePage * pageSize;
    let endIndex = startIndex + pageSize;

    this.data = new BehaviorSubject<Block[]>(dataSource.slice(startIndex, endIndex));
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Block[]> {
    return this.data;
  }

  disconnect() {}
}