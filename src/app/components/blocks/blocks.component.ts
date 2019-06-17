import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/state';
import { selectConsensusHeight } from 'src/app/state/consensus/consensus.reducers';
import { map, skipWhile, first } from "rxjs/operators";
import { HttpService } from 'src/app/services/http.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


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
    private httpService: HttpService
  ) { }

  ngOnInit() { 
    this.appStore
    .select(selectConsensusHeight)
    .pipe( 
      skipWhile( height => height === '0' ),
      map( height => height-1 ),
      first()
    )
    .subscribe( (height: any) => {
      this.httpService
      .getBlocks(height, 15)
      .subscribe((blocks:any) => {
        console.log(blocks);
        this.dataSource = new BlocksDataSource(blocks);
      });
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
export class BlocksDataSource extends DataSource<PeriodicElement> {
  /** Stream of data that is provided to the table. */
  data: BehaviorSubject<any[]>;

  constructor(dataSource) {
    super();
    this.data = new BehaviorSubject<any[]>(dataSource);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PeriodicElement[]> {
    return this.data;
  }

  disconnect() {}
}