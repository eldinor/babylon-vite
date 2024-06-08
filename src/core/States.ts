/**
 * @author Mugen87 / https://github.com/Mugen87
 * @author modified at https://github.com/eldinor/yuka-babylonjs-examples
 */

import * as YUKA from "yuka";

interface uuu {
  owner: YUKA.GameEntity;
}

const IDLE = "IDLE";
const WALK = "WALK";
const WORK = "WORK";

const ZERO = new YUKA.Vector3(0, 0, 0);

interface User {
  name: string;
}

class IdleState extends YUKA.State<YUKA.GameEntity> {
  enter(_girl: any) {
    //   girl.ui.currentState.textContent = IDLE;
    //   girl.meshToManage.material.diffuseColor = BABYLON.Color3.Blue()
    //  girl.vehicle.steering.behaviors[1].active = false
    //   girl.vehicle.steering.behaviors[0].active = true
    //   console.log(girl.vehicle.steering.behaviors[0]);
    //    console.log(girl.vehicle.steering.behaviors[1]);
  }

  execute(_girl: any) {
    if (_girl.currentTime >= _girl.idleDuration) {
      _girl.currentTime = 0;
      _girl.stateMachine.changeTo(WALK);
    }
  }

  exit(_girl: any) {
    console.log("WALK");
  }
}

class WalkState extends YUKA.State<YUKA.GameEntity> {
  enter(girl: any) {
    console.log(girl);
    console.log(girl.vehicle.steering.behaviors[0]);

    girl.vehicle.steering.behaviors[0].active = true;
    //  girl.vehicle.steering.behaviors[0].target = girl.target;

    //    girl.meshToManage.material.diffuseColor = BABYLON.Color3.Red()
    //   girl.ui.currentState.textContent = WALK;

    //   girl.walk.start();
    //   girl.idle.stop();
    //   girl.walk.loopAnimation = true;

    //  console.log(girl.vehicle.steering);

    //    const target = new YUKA.Vector3(15, 0, 6);

    //   girl.vehicle.steering.behaviors[0].active = false
    //  girl.vehicle.steering.behaviors[1].active = true
    //    console.log(girl.vehicle.steering.behaviors[0]);
    //   console.log(girl.vehicle.steering.behaviors[1]);
  }

  execute(owner: any) {
    /*
    const squaredDistance = owner.vehicle.position.squaredDistanceTo(
      owner.vehicle.steering.behaviors[0].target
    );
    console.log(squaredDistance);

   
  
    if (squaredDistance < 1) {
      owner.vehicle.steering.behaviors[0].active = false;
      owner.vehicle.velocity = new YUKA.Vector3(0, 0, 0);
      owner.currentTime = 0;
      owner.stateMachine.changeTo(WORK);
        */
    //
    if (owner.vehicle.velocity.x > 0.2) {
      console.log("sdfsdf");
    }
  }

  exit(_girl: any) {
    console.log(_girl);

    console.log("EXIT WALKSTATE");
  }
}
//

class WorkState extends YUKA.State<YUKA.GameEntity> {
  enter(_girl: any) {
    console.log("ENTER WorkState");
  }

  execute(girl: any) {
    if (girl.currentTime >= girl.workDuration) {
      girl.currentTime = 0;
      girl.stateMachine.changeTo(IDLE);
    }
  }

  exit(_girl: any) {
    console.log("EXIT FROM WORKSTATE");
  }
}
//

class ReturnHomeState extends YUKA.State<YUKA.GameEntity> {
  enter(_girl: any) {
    console.log("ENTER WorkState");
    //   girl.ui.currentState.textContent = IDLE;
    //  girl.vehicle.steering.behaviors[1].active = false
    //   girl.vehicle.steering.behaviors[0].active = true
    //   console.log(girl.vehicle.steering.behaviors[0]);
    //    console.log(girl.vehicle.steering.behaviors[1]);
  }

  execute(girl: any) {
    if (girl.currentTime >= girl.workDuration) {
      girl.currentTime = 0;
      girl.stateMachine.changeTo(IDLE);
    }
  }

  exit(_girl: any) {
    console.log("EXIT FROM WORKSTATE");
  }
}
//
export { IdleState, WalkState, WorkState, ReturnHomeState };
