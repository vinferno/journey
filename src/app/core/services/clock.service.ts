import { Injectable } from '@angular/core';
import {interval} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  public tick;

  constructor() {
    this.tick = interval(100).pipe(
      map(res => { if (res > 1) { return res; } else {return false; }})
    );
  }
}
