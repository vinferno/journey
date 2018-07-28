import {Component, Input, OnInit} from '@angular/core';
import {AllItemsService} from '../../core/services/all-items.service';
import {ClockService} from '../../core/services/clock.service';
import {FormBuilder} from '@angular/forms';
import {InputsService} from '../../core/services/inputs.service';
import {IBeingConfig} from '../../interfaces/IBeingConfig';

const movingRight = 'movingRight';
const movingLeft = 'movingLeft';
const movingUp = 'movingUp';
const movingDown = 'movingDown';
const movingAway = 'movingAway';
const movingToward = 'movingToward';

@Component({
  selector: 'vf-being-base',
  templateUrl: './being-base.component.html',
  styleUrls: ['./being-base.component.scss']
})
export class BeingBaseComponent implements OnInit {
  @Input()
  public being: IBeingConfig;
  @Input()
  public id: number;

  public style;
  public state;
  public nextPosition;

  public speed = 20;
  public distance = 0;
  public times = 0;

  // movement;
  public initialTop;
  public initialLeft;
  public adjustedTop;
  public adjustedLeft;

  constructor(
    public allItemsService: AllItemsService,
    public clock: ClockService,
    public fb: FormBuilder,
    public input: InputsService,
  ) {
  }

  ngOnInit() {
    console.log('being', this.being);
    this.allItemsService.items.push(this);
    this.input.pressed.subscribe(key => {
      if (!key) {
        return;
      }
      this.handleKeyPress(key);
    });
    this.input.up.subscribe(key => {
      if (!key) {
        return;
      }
      this.handleKeyUp(key);
    });

    this.clock.tick.subscribe(phase => {
      console.log('tick', phase);
      if (phase && this.being.animated) {

        if (phase === 'testMoves') {
          this.testMove();
        }
        if (phase === 'detectCollision') {
          this.testCollision();
        }
        if (phase === 'move') {
          this.move();
        }
        if (phase === 'draw') {
          this.draw();
        }
      }
    });


    this.style = this.fb.group({
      position: 'absolute',
      top: this.being.y + 'px',
      left: this.being.x + 'px',
      color: 'red',
      width: '100px',
      height: '100px',
      backgroundColor: 'blue',
    });
    this.state = this.fb.group({
      movingRight: false,
      movingLeft: false,
      movingUp: false,
      movingDown: false,
      movingAway: false,
      movingToward: false,
      x: this.being.x,
      y: this.being.y,
      z: this.being.z,
      xForce: 0,
      yForce: 0,
      width: 100,
      height: 100,
      gravity: this.being.gravity,
    });
    this.nextPosition = this.fb.group({
      x: 0,
      y: 0,
      z: 0,
    });
  }

  testCollisionLeft(top, left, item) {
    const myTop = this.state.value.y + top;
    const theirTop = item.state.value.y;
    const myBottom = myTop + this.state.value.height;
    const theirBottom = theirTop + item.state.value.height;
    const yOverlap = !(myTop < theirTop) && !(myTop > theirBottom) || !(myBottom < theirTop) && !(myBottom > theirBottom);
    if (!yOverlap) {
      console.log('no y overlap');
      return;
    }
    const myLeft = this.state.value.x + left;
    const theirLeft = item.state.value.x;
    const myRight = myLeft + this.state.value.width;
    const theirRight = theirLeft + item.state.value.width;
    return !(myLeft < theirLeft) && !(myLeft > theirRight) || !(myRight < theirLeft) && !(myRight > theirRight);
  }

  testCollisionTop(top, left, item) {
    const myLeft = this.state.value.x + left;
    const theirLeft = item.state.value.x;
    const myRight = myLeft + this.state.value.width;
    const theirRight = theirLeft + item.state.value.width;
    const xOverlap = !(myLeft < theirLeft) && !(myLeft > theirRight) || !(myRight < theirLeft) && !(myRight > theirRight);
    if (!xOverlap) {
      console.log('no x overlap');
      return;
    }
    const myTop = this.state.value.y + top;
    const theirTop = item.state.value.y;
    const myBottom = myTop + this.state.value.height;
    const theirBottom = theirTop + item.state.value.height;
    return !(myTop < theirTop) && !(myTop > theirBottom) || !(myBottom < theirTop) && !(myBottom > theirBottom);
  }

  public getStyle() {
    return this.style.value;
  }

  public log(...args) {
    for (let i = 0; i < args.length; i++) {
      console.log('id' , this.id, ':', args[i]);
    }
  }

  private isMoving() {
    return (
      this.state.get('movingRight').value ||
      this.state.get('movingLeft').value ||
      this.state.get('movingUp').value ||
      this.state.get('movingDown').value
    );
  }

  private testMove() {
    this.initialTop = this.determineTop();
    this.initialLeft = this.determineLeft();
  }

  private testCollision() {
    let adjustedTop = this.initialTop;
    let adjustedLeft = this.initialLeft;
    this.allItemsService.items.forEach(item => {
      if (item.id === this.id) {
        return;
      }
      const angleOpen = !this.testCollisionLeft(adjustedTop, adjustedLeft, item) && !this.testCollisionTop(adjustedTop, adjustedLeft, item);
      const leftOnly = !this.testCollisionLeft(0, adjustedLeft, item) && !this.testCollisionTop(0, adjustedLeft, item);
      const topOnly = !this.testCollisionLeft(adjustedTop, 0, item) && !this.testCollisionTop(adjustedTop, 0, item);
      const notInWay = !this.testCollisionLeft(top, this.initialLeft, item) && !this.testCollisionTop(top, this.initialLeft, item);
      if (notInWay) {
        item.style.get('backgroundColor').setValue('green');
      } else {
        item.style.get('backgroundColor').setValue('red');
      }
      if (angleOpen) {
        console.log('angle open');
        return;
      } else {
      }

      if (!angleOpen && leftOnly) {
        console.log('left only open');
        item.style.get('backgroundColor').setValue('red');
        return adjustedTop = this.testTopDiff(adjustedTop, adjustedLeft, item);
      }

      if (!angleOpen && !leftOnly && topOnly) {
        console.log('top only');
        item.style.get('backgroundColor').setValue('red');
        return adjustedLeft = this.testLeftDiff(adjustedTop, adjustedLeft, item);
      }
      console.log('nothing open', angleOpen, topOnly, leftOnly);
      item.style.get('backgroundColor').setValue('red');
      adjustedTop = this.testTopDiff(adjustedTop, adjustedLeft, item);
      adjustedLeft = this.testLeftDiff(adjustedTop, adjustedLeft, item);
    });

    this.adjustedLeft = adjustedLeft;
    this.adjustedTop = adjustedTop;
  }

  private move() {
    if (this.adjustedTop) {
      console.log('adjusted top', this.adjustedTop);
      this.moveTop(this.adjustedTop);
    }

    if (this.adjustedLeft) {
      console.log('adjusted left', this.adjustedLeft);
      this.moveLeft(this.adjustedLeft);
    }
  }

  private testLeftDiff(top, left, item) {
    let diff;
    const goingRight = left > 0;
    const goingLeft = left < 0;
    const myLeft = this.state.value.x;
    const theirLeft = item.state.value.x;
    const myRight = myLeft + this.state.value.width;
    const theirRight = theirLeft + item.state.value.width;
    if (goingRight) {
      diff = theirLeft - myRight - 1;
      console.log('going right', diff);
      return diff > 0 ? diff : 0;
    }
    if (goingLeft) {
      diff = theirRight - myLeft + 1;
      console.log('going left', diff);
      return diff < 0 ? diff : 0;
    }
  }

  private testTopDiff(top, left, item) {
    let diff;
    const goingBottom = top > 0;
    const goingTop = top < 0;
    const myTop = this.state.value.y;
    const theirTop = item.state.value.y;
    const myBottom = myTop + this.state.value.height;
    const theirBottom = theirTop + item.state.value.height;
    if (goingBottom) {
      diff = theirTop - myBottom - 1;
      console.log('going down', diff);
      return diff > 0 ? diff : 0;
    }
    if (goingTop) {
      diff = theirBottom - myTop + 1;
      console.log('going up', diff);
      return diff < 0 ? diff : 0;
    }
  }

  private moveLeft(distance) {
    const x = this.state.get('x');
    x.setValue(x.value + distance);
  }

  private moveTop(distance) {
    this.distance = distance;
    this.times++;
    const y = this.state.get('y');
    y.setValue(y.value + distance);
  }

  private draw() {
    const x = this.state.get('x');
    this.style.get('left').setValue(x.value + 'px');
    const y = this.state.get('y');
    this.style.get('top').setValue(y.value + 'px');
  }

  private determineTop() {
    this.state.get('yForce').setValue(this.state.get('gravity').value);
    let top = this.state.get('yForce').value;
    this.state.value.movingUp ? top += (this.speed * 2) * -1 : top += 0;
    this.state.value.movingDown ? top = (this.speed) : top += 0;
    return top;
  }

  private determineLeft() {
    let left = this.state.get('xForce').value;
    this.state.value.movingLeft ? left += -this.speed : left += 0;
    this.state.value.movingRight ? left += this.speed : left += 0;

    return left;
  }

  private handleKeyPress(key) {
    if (key.key === this.being.keys.right) {
      this.state.get(movingRight).setValue(true);
    }
    if (key.key === this.being.keys.left) {
      this.state.get(movingLeft).setValue(true);
    }
    if (key.key === this.being.keys.up) {
      this.state.get(movingUp).setValue(true);
    }
    if (key.key === this.being.keys.down) {
      this.state.get(movingDown).setValue(true);
    }

    if (key.key === this.being.keys.away) {
      this.state.get(movingAway).setValue(true);
    }
    if (key.key === this.being.keys.toward) {
      this.state.get(movingToward).setValue(true);
    }
  }

  private handleKeyUp(key) {
    if (key.key === this.being.keys.right) {
      this.state.get(movingRight).setValue(false);
    }
    if (key.key === this.being.keys.left) {
      this.state.get(movingLeft).setValue(false);
    }
    if (key.key === this.being.keys.up) {
      this.state.get(movingUp).setValue(false);
    }
    if (key.key === this.being.keys.down) {
      this.state.get(movingDown).setValue(false);
    }

    if (key.key === this.being.keys.away) {
      this.state.get(movingAway).setValue(false);
    }
    if (key.key === this.being.keys.toward) {
      this.state.get(movingToward).setValue(false);
    }
  }

}
