import { Injectable, Type } from '@angular/core';
import { BlockComponent } from '../templates/block/block.component';
import { TransactionComponent } from '../templates/transaction/transaction.component';

export class Template {
  constructor(public component: Type<any>, public data: any) {}
}

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor() { }

  public getBlockTemplate(data) {
    return (new Template(BlockComponent, data)); 
  }

  public getTransactionTemplate(data) {
    return (new Template(TransactionComponent, data)); 
  }
}
