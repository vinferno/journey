import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllItemsService {
  public time;
  public items = [];

  constructor() {
    this.time = new Date().toISOString();
  }
}
