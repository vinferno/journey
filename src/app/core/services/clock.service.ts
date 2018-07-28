import { Injectable } from '@angular/core';
import {interval} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  public tick;
  public phases = ['testMoves', 'detectCollision', 'move', 'draw'];
  public phase = 0;

  constructor() {
    this.tick = interval(100).pipe(
      map(res => { return this.phases[res % this.phases.length]; })
    );
  }
}
