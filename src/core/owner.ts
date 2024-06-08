import * as YUKA from "yuka";

import { IdleState, WalkState, WorkState } from "./States";

class Girl extends YUKA.Vehicle {
  vehicle!: YUKA.Vehicle;
  stateMachine: YUKA.StateMachine<YUKA.GameEntity>;
  currentTime: number;
  idleDuration: number;
  walkDuration: number;
  sleepDuration: number;
  workDuration: number;
  needs: any;
  target: YUKA.GameEntity;

  constructor(vehicle: YUKA.Vehicle, target: YUKA.GameEntity) {
    super();

    this.needs = {};
    this.needs.sleep = 0;
    this.needs.eat = 0;
    this.needs.work = 1;

    this.vehicle = vehicle;

    this.target = target;

    //    this.ui = {
    //       currentState: document.getElementById("currentState"),
    //    };

    //

    this.stateMachine = new YUKA.StateMachine(this as any);

    this.stateMachine.add("IDLE", new IdleState());
    this.stateMachine.add("WALK", new WalkState());
    this.stateMachine.add("WALK", new WorkState());

    this.stateMachine.changeTo("IDLE");

    //

    this.currentTime = 0; // tracks how long the entity is in the current state
    this.idleDuration = 9; // duration of a single state in seconds
    this.walkDuration = 14; // duration of a single state in seconds

    this.sleepDuration = 8;
    this.workDuration = 6;

    const arriveBehavior = new YUKA.ArriveBehavior(
      this.target.position,
      2.5,
      0.1
    );
    //  arriveBehavior.active = false;
    this.vehicle.steering.add(arriveBehavior);

    //  this.crossFadeDuration = 1; // duration of a crossfade in seconds
  }
  //@ts-ignore
  update(delta: number) {
    this.currentTime += delta;

    this.stateMachine.update();
  }
}

export { Girl };
