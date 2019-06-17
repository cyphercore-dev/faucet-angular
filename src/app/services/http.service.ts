import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { nodeRpc1 } from '../config';
import { range, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private httpClient: HttpClient,
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
}
