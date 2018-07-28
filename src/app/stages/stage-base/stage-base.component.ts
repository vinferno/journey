import {Component, OnInit} from '@angular/core';
import {AllItemsService} from '../../core/services/all-items.service';
import {HttpClient} from '@angular/common/http';
import {IBeingConfig} from '../../interfaces/IBeingConfig';

@Component({
  selector: 'vf-stage-base',
  templateUrl: './stage-base.component.html',
  styleUrls: ['./stage-base.component.scss']
})
export class StageBaseComponent implements OnInit {

  public gravity = 10;
  public beings: IBeingConfig[] = [];
  public ready = false;

  public stageConfig;
  public static getPlayer({x, y, z, left, right, down, up, away, toward, gravity}): IBeingConfig {
    return {
      type: 'player', x, y, z, solid: true, id: 1, gravity,
      keys: {left, right, down, up, away, toward},
      animated: true,
    };
  }

  public static getPlatform({x, y, z, left, right, down, up, away, toward, gravity}): IBeingConfig {
    return {
      type: 'platform', x, y, z, solid: true, id: 1, gravity,
      keys: {left, right, down, up, away, toward},
      animated: false,
    };
  }

  constructor(
    public allItemsService: AllItemsService,
    public http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.http.get('./assets/stage1.json').subscribe( res => {

      this.stageConfig = res;
      this.init();
    });

  }

  public init() {
    this.stageConfig.players.forEach( player => {
      this.beings.push(StageBaseComponent.getPlayer(player));
    });
    this.stageConfig.platforms.forEach( platform => {
      this.beings.push(StageBaseComponent.getPlatform( platform ));
    });
    this.ready = true;
    console.log('ready');
  }


}
