import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { nodeRpc1, nodeRpc2 } from '../config';
import { range, forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { State } from '../state';
import { Store } from '@ngrx/store';
import { UpdateBlocks } from '../state/blocks/blocks.actions';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private httpClient: HttpClient,
    private appStore: Store<State>
  ) { }

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

  getTxs(height) {
    return this.httpClient.get(`${nodeRpc1}/txs?tx.height=${height}`)
  }
}
