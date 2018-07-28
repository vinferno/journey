import {IKeys} from './Ikeys';

export class IBeingConfig {
  solid: boolean;
  type: string;
  id: number;
  x: number;
  y: number;
  z: number;
  gravity: number;
  keys: IKeys;
  animated: boolean;

  constructor
  () {
    this.solid = null;
    this.type = null;
    this.id = null;
    this.keys = null;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.gravity = 0;
  }
}
