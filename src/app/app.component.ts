import { Component, OnInit, HostBinding } from '@angular/core';
import { WsService } from './services/ws.service';
import { Store } from '@ngrx/store';
import { State } from './state';
import { selectConsensusState, selectConsensusHeight } from './state/consensus/consensus.reducers';
import { skipWhile, map, first, filter, concatMap, skip } from 'rxjs/operators';
import { HttpService } from './services/http.service';
import { selectBlocks } from './state/blocks/blocks.reducers';
import { from } from 'rxjs';
import { UpdateTxs } from './state/txs/txs.actions';
import { OverlayContainer } from '@angular/cdk/overlay';
import { selectActiveTheme } from './state/settings/settings.reducers';
import { ToggleTheme } from './state/settings/settings.actions';
import { OverlayService } from './components/shared/modal/services/overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @HostBinding('class') componentCssClass;
  consensus$ = this.appStore.select(selectConsensusState);
  theme$ = this.appStore.select(selectActiveTheme);

  constructor(
    private wsService: WsService,
    private appStore: Store<State>,
    private httpService: HttpService,
    public overlayContainer: OverlayContainer,
    // private overlayService: OverlayService
  ) { 
    this.theme$.subscribe((theme: string) => {
      this.overlayContainer.getContainerElement().className = `cdk-overlay-container ${theme}`;
      this.componentCssClass = theme;
    });
  }

  ngOnInit() {
    this.initBlocks();
    this.initTxs();
  }

  onToggleTheme() {
    this.appStore.dispatch(new ToggleTheme());
  }
  
  // onOpenModal(data) {
  //   this.overlayService.openModal(data);
  // }

  initBlocks() {
   this.appStore
    .select(selectConsensusHeight)
    .pipe( 
      skipWhile( height => height === '0' ),
      map( height => height-1 ),
      first()
    )
    .subscribe( (height: any) => {
      console.log(height)
      this.httpService
      .init100Blocks(height);

      this.subBlocks$();
    });
  }

  subBlocks$() {
    this.appStore
      .select(selectConsensusHeight)
      .pipe( 
        skip(1),
        map( height => height-1 )
      )
      .subscribe( (height: any) => {
        this.httpService.add1Block(height);
      });
  }

  initTxs() {
    let transactions = [];
    this.appStore
    .select(selectBlocks)
    .pipe(
      skipWhile(blocks => blocks.length === 0),
      first()
    )
    .subscribe((blocks: any) => {
      from(blocks)
      .pipe(
        filter((block:any) => block.txs !== '0'),
        concatMap(block => this.httpService.getTxs(block.height))
      )
      .subscribe((txs:any) => {
        transactions.push(...txs);
      },
      (err) => console.log,
      () => {
        // console.log(transactions);
        let formattedTransactions = [];
        from(transactions)
        .subscribe((transaction:any) => {

          let formattedTransaction = {
            hash: transaction.txhash, 
            height: transaction.height,
            gasUsed: transaction.gas_used,
            gasWanted: transaction.gas_wanted,
            time: transaction.timestamp,
            // details: transaction,
            fee: transaction.tx.value.fee,
            memo: transaction.tx.value.memo,
            msg: transaction.tx.value.msg,
            error: null,
            action: []
          };
    
          if(transaction.tags) {
            let index = 0;
            transaction.tags.forEach((tag:any) => {
              // TODO remove debugging
              // console.log(tag);
              if(tag.key === 'action') {
                formattedTransaction.action[index] = tag.value.replace(/_/g, ' ');
                index += 1;
              }
            });
          }
          // END LOGIC FOR NOT-FAULTY  
    
          if(transaction.code === 12) {
            formattedTransaction.error = "out of gas";
          } else if (transaction.code === 104) {
            formattedTransaction.error = "no delegation distribution info";
          } else if (transaction.code === 10) {
            formattedTransaction.error = "insufficient account funds";
          } else if (transaction.code === 102) {
            formattedTransaction.error = "no delegation for this (address, validator) pair";
          } else if (transaction.code) {
            // TODO @aakatev find more failed tx codes
            formattedTransaction.error = "TEST"
            console.log(transaction);
          }
          formattedTransactions.push(formattedTransaction);
        },
        (err) => console.log,
        () => {
          this.appStore.dispatch(new UpdateTxs(formattedTransactions));
        });
      });
    });
  }
}