import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { nodeRpc1, nodeRpc2, faucetRpc } from '../config';
import { range, forkJoin, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../state';
import { Store } from '@ngrx/store';
import { UpdateBlocks, AddBlock } from '../state/blocks/blocks.actions';
import { AddTx } from '../state/txs/txs.actions';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private httpClient: HttpClient,
    private appStore: Store<State>
  ) { }

  getAccount(address) {
    return this.httpClient.get(`${nodeRpc1}/auth/accounts/${address}`);
  }

  postFaucet(address) {
    return this.httpClient.post(`${faucetRpc}/faucet/request`, { recipient: address });
  }

  getBlock(height) {
    return this.httpClient.get(`${nodeRpc1}/blocks/${height}`);
  }

  getBlocks(height, limit) {
    const counter$ = range(0, limit);
    const reqsPool = [];
    
    counter$.subscribe((count:any) => {
      reqsPool.push(
        this.getBlock(height-count)
        .pipe(
          map((block:any) => {
            return ({
              height: block.block_meta.header.height,
              hash: block.block_meta.block_id.hash,
              proposer: block.block_meta.header.proposer_address,
              txs: block.block_meta.header.num_txs,
              time: block.block_meta.header.time,
            });
          })
        )
      );
    });

    return forkJoin(reqsPool);
  }

  init100Blocks(height) {
    this.get100Blocks(height)
    .subscribe(([res1, res2, res3, res4, res5]) => {
      this.appStore.dispatch(new UpdateBlocks(
        [
          ...res1,
          ...res2,
          ...res3,
          ...res4,
          ...res5
        ].map((block:any) => {
          return ({
            height: block.header.height,
            hash: block.block_id.hash,
            proposer: block.header.proposer_address,
            txs: block.header.num_txs,
            time: block.header.time,
          });
        })
      ));
    });
  }

  add1Block(height) {
    this.get1Block(height).subscribe( (block:any) => {
      this.appStore.dispatch(new AddBlock(
        {
          height: block.header.height,
          hash: block.block_id.hash,
          proposer: block.header.proposer_address,
          txs: block.header.num_txs,
          time: block.header.time,
        })
      );
      if( block.header.num_txs !== '0' ) {
        this.getTxs(block.header.height)
        .subscribe((txs:any) => {

          from(txs.txs)
          .subscribe((transaction:any) => {

            let formattedTransaction = {
              hash: transaction.txhash, 
              height: transaction.height,
              gasUsed: transaction.gas_used,
              gasWanted: transaction.gas_wanted,
              time: transaction.timestamp,
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
            this.appStore.dispatch(new AddTx(formattedTransaction));
          });
        });
      }
    });
  }

  get100Blocks(height) { 
    return forkJoin(
      this.get20Blocks(height),
      this.get20Blocks(height-20),
      this.get20Blocks(height-40),
      this.get20Blocks(height-60),
      this.get20Blocks(height-80)
    )
  }

  get20Blocks(height):Observable<any[]> {
    return this.httpClient
          .get(`${nodeRpc2}/blockchain?minHeight=${height-20}&maxHeight=${height}`)
          .pipe(
            map((res:any) => res.result.block_metas)
          );
  }

  get1Block(height):Observable<any[]> {
    return this.httpClient
          .get(`${nodeRpc2}/blockchain?minHeight=${height}&maxHeight=${height}`)
          .pipe(
            map((res:any) => res.result.block_metas[0])
          );
  }

  getTxs(height) {
    return this.httpClient.get(`${nodeRpc1}/txs?tx.height=${height}`)
  }
}
