import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { OverlayService } from '../modal/services/overlay.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input('columns')
  displayedColumns: any[];
  
  @Input('data')
  data$: BehaviorSubject<any[]>;

  @Output() 
  onClick = new EventEmitter();

  dataSource: SlicedDataSource;
  tablePageSize = 10;
  tableActivePage = 0;
  tableMaxPage = 0;

  constructor(    
    private overlayService: OverlayService
  ) { }

  ngOnInit() { 
    this.data$.subscribe((data)=> {
      this.onDataSourceUpdate(data);
    });
  }

  onOpenModal(data) {
    this.overlayService.openModal(data);
  }


  getColumns() {
    return this.displayedColumns.map(columns => columns.def)
  }

  onDataSourceUpdate(data) {
    this.tableMaxPage = Math.ceil(data.length / this.tablePageSize)-1;

    this.dataSource = new SlicedDataSource(
      data,
      this.tablePageSize,
      this.tableActivePage
    );
  }

  onTableNextPage() {
    if(this.tableActivePage < this.tableMaxPage) {
      this.tableActivePage += 1;
      this.onDataSourceUpdate(this.data$.value)
    }
  }

  onTablePrevPage() {
    if(this.tableActivePage > 0) {
      this.tableActivePage -= 1;
      this.onDataSourceUpdate(this.data$.value)
    }
  }

}


export class SlicedDataSource extends DataSource<any> {
  data: BehaviorSubject<any[]>;

  constructor(dataSource, pageSize, activePage) {
    super();
    
    let startIndex = activePage * pageSize;
    let endIndex = startIndex + pageSize;
    this.data = new BehaviorSubject<any[]>(
      dataSource.slice(startIndex, endIndex)
    );
  }

  connect(): Observable<any[]> {
    return this.data;
  }

  disconnect() {}
}