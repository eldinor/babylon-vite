import * as YUKA from "yuka";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
// import { IdleState, WalkState } from './States.js'

const IDLE = "IDLE";
const TAKE = "TAKE";
const BACK = "BACK";

export class Drone extends YUKA.Vehicle {
  target: YUKA.Vector3;
  amount: number;
  isBusy: boolean;
  entities: never[];
  warehouse: any;
  stateMachine: YUKA.StateMachine<YUKA.Vehicle>;
  currentTime: number;
  constructor(name: string) {
    super();

    this.name = name;
    this.currentTime = 0;

    this.maxSpeed = 5;
    this.maxForce = 20;

    this.amount = 0;
    this.isBusy = false;

    // this.entities = [];

    //  this.warehouse = warehouse;

    //  this.warehouse.entityManager.add(this);

    this.target = new YUKA.Vector3(3, 0, 2);

    const arriveBehavior = new YUKA.ArriveBehavior(this.target, 2.5, 0.1);
    //  arriveBehavior.active = false;
    this.steering.add(arriveBehavior);

    this.stateMachine = new YUKA.StateMachine(this as any);
    this.stateMachine.add(IDLE, new IdleState());
    this.stateMachine.add(TAKE, new TakeState());
    this.stateMachine.add(BACK, new BackState());
    this.stateMachine.changeTo(TAKE);
  }
  /*
  //@ts-ignore
  update(delta: number) {
    this.currentTime += delta;

    this.stateMachine.update();
  }
  */
}

export class IdleState extends YUKA.State<YUKA.GameEntity> {
  enter(drone) {
    console.log("ENTER IDLE");
    drone.velocity = new YUKA.Vector3(0, 0, 0);
    drone.steering.behaviors[0].active = false;
  }

  execute(drone: any) {}

  exit(drone) {}
}

class TakeState extends YUKA.State<YUKA.GameEntity> {
  enter(drone) {
    console.log("ENTER TAKE");
    drone.steering.behaviors[0].active = true;
  }

  execute(drone) {
    const squaredDistance = drone.position.squaredDistanceTo(drone.target);
    // console.log(squaredDistance);
    if (squaredDistance < 0.1) {
      drone.stateMachine.changeTo(BACK);
    }
  }

  exit(drone) {
    drone.steering.behaviors[0].target = new YUKA.Vector3(0, 5, 0);
  }
}

class BackState extends YUKA.State<YUKA.GameEntity> {
  enter(drone) {
    console.log("ENTER BACK");
    drone.steering.behaviors[0].active = true;
    drone.steering.behaviors[0].target = new YUKA.Vector3(-10, 1, 0);
  }

  execute(drone) {
    const squaredDistance = drone.position.squaredDistanceTo(
      // drone.steering.behaviors[0].target
      drone.steering.behaviors[0].target
    );
    // console.log(squaredDistance)
    if (squaredDistance < 0.1) {
      drone.stateMachine.changeTo(IDLE);
    }
  }

  exit(drone) {}
}
