import {
  Component,
  computed,
  effect,
  OnInit,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonComponent } from './components/balloon/balloon.component';
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BalloonComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.startGame();
  }
  balloonsonScreen = 6;
  balloons: IBalloon[] = [];
  score = 0;
  missed = signal(0);
  maxMissed = 10;
  gameOver = computed(() => {
    return this.missed() === this.maxMissed;
  });
  ballonElements = viewChildren(BalloonComponent);
  createBalloonsOnDemand = effect(() => {
    if (
      !this.gameOver() &&
      this.ballonElements().length < this.balloonsonScreen
    ) {
      this.balloons = [...this.balloons, new Balloon()];
    }
  });

  startGame() {
    this.missed.set(0);
    this.score = 0;
    this.balloons = new Array(this.balloonsonScreen)
      .fill(0)
      .map(() => new Balloon());
  }

  balloonpopHnadler(balloonId: string) {
    this.score++;
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
    this.balloons = [...this.balloons, new Balloon()];
  }
  balloonMisshandler(balloonId: string) {
    this.missed.update((val) => val + 1);
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
  }
}
