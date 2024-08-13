import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { IBalloon } from '../../balloon.interface';
import {
  animate,
  animation,
  AnimationBuilder,
  keyframes,
  style,
} from '@angular/animations';
import { buffer } from 'rxjs';

@Component({
  selector: 'app-balloon',
  standalone: true,
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.scss',
})
export class BalloonComponent implements OnInit {
  balloon = input.required<IBalloon>();
  animBuilder = inject(AnimationBuilder);
  eleref = inject(ElementRef);
  @Output() balloonPopped = new EventEmitter();

  @Output() missingballoonPopped = new EventEmitter<string>();

  ngOnInit(): void {
    this.animateBalloon();
  }

  animateBalloon() {
    const buffer = 20;
    const maxWidth =
      window.innerWidth -
      this.eleref.nativeElement.firstChild.clientWidth -
      buffer;
    const leftpostion = Math.floor(Math.random() * maxWidth);
    const minspeed = 2;
    const speedvariations = 3;
    const speed = minspeed + Math.random() * speedvariations;
    const flyAnimation = this.animBuilder.build([
      style({
        translate: `${leftpostion}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }),
      animate(
        `${speed}s ease-out`,
        style({
          translate: `${leftpostion}px  -100vh`,
        })
      ),
    ]);
    const player = flyAnimation.create(this.eleref.nativeElement.firstChild);
    player.play();
    player.onDone(() => {
      this.missingballoonPopped.emit(this.balloon().id);
    });
  }

  Pop() {
    const popAnimation = this.animBuilder.build([
      animate(
        '0.2s ease-out',
        keyframes([
          style({
            scale: '1.2',
            offset: '0.5',
          }),
          style({
            scale: '0.8',
            offset: '0.75',
          }),
        ])
      ),
    ]);
    const player = popAnimation.create(this.eleref.nativeElement.firstChild);
    player.play();
    player.onDone(() => {
      this.balloonPopped.emit(this.balloon().id);
    });
  }
}
