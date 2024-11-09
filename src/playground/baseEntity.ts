import { Vector3, Quaternion, Matrix } from "@babylonjs/core";
import { v4 as uuidv4 } from "uuid";

const targetRotation = new Quaternion();
const targetDirection = new Vector3();
const positionWorld = new Vector3();
const quaternionWorld = new Quaternion();

export class GameEntity {
  name: string;
  active: boolean;
  children: any[];
  parent: null;
  neighbors: any[];
  neighborhoodRadius: number;
  updateNeighborhood: boolean;
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
  forward: Vector3;
  up: Vector3;
  boundingRadius: number;
  maxTurnRate: number;
  canActivateTrigger: boolean;
  manager: null;
  _localMatrix: any;
  _worldMatrix: any;
  _cache: { position: Vector3; rotation: Quaternion; scale: Vector3 };
  _renderComponent: null;
  _renderComponentCallback: null;
  _started: boolean;
  _uuid: string | null;
  _worldMatrixDirty: boolean;

  /**
   * Constructs a new game entity.
   */
  constructor() {
    /**
     * The name of this game entity.
     * @type {String}
     */
    this.name = "";

    /**
     * Whether this game entity is active or not.
     * @type {Boolean}
     * @default true
     */
    this.active = true;

    /**
     * The child entities of this game entity.
     * @type {Array<GameEntity>}
     */
    this.children = new Array();

    /**
     * A reference to the parent entity of this game entity.
     * Automatically set when added to a {@link GameEntity}.
     * @type {?GameEntity}
     * @default null
     * @readonly
     */
    this.parent = null;

    /**
     * A list of neighbors of this game entity.
     * @type {Array<GameEntity>}
     * @readonly
     */
    this.neighbors = new Array();

    /**
     * Game entities within this radius are considered as neighbors of this entity.
     * @type {Number}
     * @default 1
     */
    this.neighborhoodRadius = 1;

    /**
     * Whether the neighborhood of this game entity is updated or not.
     * @type {Boolean}
     * @default false
     */
    this.updateNeighborhood = false;

    /**
     * The position of this game entity.
     * @type {Vector3}
     */
    this.position = new Vector3();

    /**
     * The rotation of this game entity.
     * @type {Quaternion}
     */
    this.rotation = new Quaternion();

    /**
     * The scaling of this game entity.
     * @type {Vector3}
     */
    this.scale = new Vector3(1, 1, 1);

    /**
     * The default forward vector of this game entity.
     * @type {Vector3}
     * @default (0,0,1)
     */
    this.forward = new Vector3(0, 0, 1);

    /**
     * The default up vector of this game entity.
     * @type {Vector3}
     * @default (0,1,0)
     */
    this.up = new Vector3(0, 1, 0);

    /**
     * The bounding radius of this game entity in world units.
     * @type {Number}
     * @default 0
     */
    this.boundingRadius = 0;

    /**
     * The maximum turn rate of this game entity in radians per seconds.
     * The only method that uses this property right now is {@link GameEntity#rotateTo}.
     * @type {Number}
     * @default π
     */
    this.maxTurnRate = Math.PI;

    /**
     * Whether the entity can activate a trigger or not.
     * @type {Boolean}
     * @default true
     */
    this.canActivateTrigger = true;

    /**
     * A reference to the entity manager of this game entity.
     * Automatically set when added to an {@link EntityManager}.
     * @type {EntityManager}
     * @default null
     * @readonly
     */
    this.manager = null;

    // private properties

    // local transformation matrix. no part of the public API due to caching

    this._localMatrix = new Matrix();

    // internal world matrix reference (only accessible via a getter)

    this._worldMatrix = new Matrix();

    // per-entity cache in order to avoid unnecessary matrix calculations

    this._cache = {
      position: new Vector3(),
      rotation: new Quaternion(),
      scale: new Vector3(1, 1, 1),
    };

    // render component

    this._renderComponent = null;
    this._renderComponentCallback = null;

    // flag to indicate whether the entity was updated by its manager at least once or not

    this._started = false;

    //

    this._uuid = null;

    // if set to true, it means the world matrix requires a recomputation

    this._worldMatrixDirty = false;
  }
  //
  /**
   * A transformation matrix representing the world space of this game entity.
   * @type {Matrix4}
   * @readonly
   */
  get worldMatrix() {
    // this._updateWorldMatrix();

    return this._worldMatrix;
  }

  /**
   * Unique ID, primarily used in context of serialization/deserialization.
   * @type {String}
   * @readonly
   */
  get uuid() {
    if (this._uuid === null) {
      this._uuid = uuidv4();
    }

    return this._uuid;
  }
  /**
   * Executed when this game entity is updated for the first time by its {@link EntityManager}.
   *
   * @return {GameEntity} A reference to this game entity.
   */
  start(): GameEntity {
    return this;
  }

  /**
   * Updates the internal state of this game entity. Normally called by {@link EntityManager#update}
   * in each simulation step.
   *
   * @param {Number} delta - The time delta.
   * @return {GameEntity} A reference to this game entity.
   */
  update(/* delta */): GameEntity {
    return this;
  }

  /**
   * Adds a game entity as a child to this game entity.
   *
   * @param {GameEntity} entity - The game entity to add.
   * @return {GameEntity} A reference to this game entity.
   */
  add(entity) {
    if (entity.parent !== null) {
      entity.parent.remove(entity);
    }

    this.children.push(entity);
    entity.parent = this;

    return this;
  }

  /**
   * Removes a game entity as a child from this game entity.
   *
   * @param {GameEntity} entity - The game entity to remove.
   * @return {GameEntity} A reference to this game entity.
   */
  remove(entity) {
    const index = this.children.indexOf(entity);
    this.children.splice(index, 1);

    entity.parent = null;

    return this;
  }
  /**
   * Computes the current direction (forward) vector of this game entity
   * and stores the result in the given vector.
   *
   * @param {Vector3} result - The direction vector of this game entity.
   * @return {Vector3} The direction vector of this game entity.
   */
  getDirection(result) {
    // return result.copyFrom(this.forward).applyRotation(this.rotation).normalize();
    return result.copyFrom(this.forward).applyRotationQuaternion(this.rotation).normalize();
  }

  getWorldPosition(result: Vector3) {
    console.log(this.worldMatrix._m);

    let x = this.worldMatrix._m[12];
    let y = this.worldMatrix._m[13];
    let z = this.worldMatrix._m[14];

    return (result = new Vector3(x, y, z));
    // return (result as any).extractPositionFromMatrix(this.worldMatrix);
  }

  /**
   * Directly rotates the entity so it faces the given target position.
   *
   * @param {Vector3} target - The target position.
   * @return {GameEntity} A reference to this game entity.
   */

  lookAt(target: Vector3): GameEntity {
    const parent: GameEntity | null = this.parent;

    if (parent !== null) {
      this.getWorldPosition(positionWorld);

      let subbed = target.subtract(positionWorld);

      targetDirection.subtractToRef(subbed, targetDirection).normalize();

      console.log(targetDirection);

      (this.rotation as any).lookAt(this.forward, targetDirection, this.up);

      let rotMatrix: Matrix = (parent as any).worldMatrix.getRotationMatrix();
      let rottn = Quaternion.FromRotationMatrix(rotMatrix);

      //  quaternionWorld.extractRotationFromMatrix(parent.worldMatrix).inverse();

      //  this.rotation.premultiply(quaternionWorld);
    } else {
      targetDirection.subtractToRef(target.subtract(this.position), targetDirection).normalize();

      (this.rotation as any).lookAt(this.forward, targetDirection, this.up);
    }

    return this;
  }

  /**
   * Given a target position, this method rotates the entity by an amount not
   * greater than {@link GameEntity#maxTurnRate} until it directly faces the target.
   *
   * @param {Vector3} target - The target position.
   * @param {Number} delta - The time delta.
   * @param {Number} tolerance - A tolerance value in radians to tweak the result
   * when a game entity is considered to face a target.
   * @return {Boolean} Whether the entity is faced to the target or not.
   */
  /*
	rotateTo( target, delta, tolerance = 0.0001 ) {

		const parent = this.parent;

		if ( parent !== null ) {

			this.getWorldPosition( positionWorld );

			targetDirection.subVectors( target, positionWorld ).normalize();

			targetRotation.lookAt( this.forward, targetDirection, this.up );

			quaternionWorld.extractRotationFromMatrix( parent.worldMatrix ).inverse();

			targetRotation.premultiply( quaternionWorld );

		} else {

			targetDirection.subVectors( target, this.position ).normalize();

			targetRotation.lookAt( this.forward, targetDirection, this.up );

		}

		return this.rotation.rotateTo( targetRotation, this.maxTurnRate * delta, tolerance );

	}
  */
  //

  //
}
