import { AStar } from '../../core/ai/a-star';
import { GameState } from '../../core/game-state';
import { SlimeState } from './slime.state';

export class SlimeMovementAI {
  update(dT: number, state: SlimeState, gameState: GameState) {
    if (state.stepTimer > 0) {
      state.position.x += state.velocity.x * dT * state.speed;
      state.position.y += state.velocity.y * dT * state.speed;
      state.stepTimer -= dT * state.speed;
      if (state.stepTimer <= 0) {
        state.position.x = Math.round(state.position.x);
        state.position.y = Math.round(state.position.y);
        state.currentSleepTime = state.sleepTime;
      }
    } else {
      if (state.currentSleepTime > 0) {
        state.currentSleepTime -= dT;
        return;
      }
      if (Math.random() < 0.5) {
        //random walk
        let retry = 10;
        do {
          state.stepTimer = 1;
          if (Math.random() > 0.5) {
            state.velocity = { x: 0, y: Math.random() > 0.5 ? 1 : -1 };
          } else {
            state.velocity = { x: Math.random() > 0.5 ? 1 : -1, y: 0 };
          }
          this.getDirectionByVelocity(state);
          const target = {
            x: state.position.x + state.velocity.x,
            y: state.position.y + state.velocity.y,
          };
          if (gameState.isSolidTile(target) || target.x < 0 || target.y < 0 || target.x > 15 || target.y > 11) {
            retry--;
            if (retry <= 0) {
              console.log('give up for ', target);
              state.velocity = { x: 0, y: 0 };
              state.stepTimer = 0;
            }
          } else {
            retry = -1;
          }
        } while (retry >= 0);
      } else {
        //path searching
        const path = new AStar(gameState).getPath(state.position, gameState.player.state.position);
        state.velocity = path[0];
        state.stepTimer = 1;
        this.getDirectionByVelocity(state);
        return;
      }
    }
  }

  getDirectionByVelocity(state: SlimeState) {
    if (state.velocity.x == 0) {
      state.direction = state.velocity.y > 0 ? 'DOWN' : 'UP';
    } else {
      state.direction = state.velocity.x > 0 ? 'RIGHT' : 'LEFT';
    }
  }
}
