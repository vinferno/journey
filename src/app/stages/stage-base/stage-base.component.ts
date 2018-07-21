import {Component, OnInit} from '@angular/core';
import {AllItemsService} from '../../core/services/all-items.service';

@Component({
  selector: 'vf-stage-base',
  templateUrl: './stage-base.component.html',
  styleUrls: ['./stage-base.component.scss']
})
export class StageBaseComponent implements OnInit {

  public beings = [];
  public static getPlayer({x, y, z, left, right, down, up, gravity}) {
    return {
      type: 'player', x, y, z, solid: true, id: 1, gravity,
      keys: {left, right, down, up}
    };
  }

  constructor(
    public allItemsService: AllItemsService,
  ) {
  }

  ngOnInit() {
    this.beings.push(StageBaseComponent.getPlayer({z: 100, x: 300, y: 100, down: 'd', up: 'e', right: 'f', left: 's', gravity: 10}));

    for (let i = 0; i < 20; i++) {
      this.beings.push(StageBaseComponent.getPlayer({z: 100, x: 200 * i, y: 300, down: 'k', up: 'i', right: 'l', left: 'j', gravity: 1}));
    }
  }


}
