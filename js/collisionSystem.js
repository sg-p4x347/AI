class CollisionSystem extends WorldSystem {
	constructor(wem) {
        super(wem);
	}
	SyncEntities() {
		this.Entities = this.WEM.Where(Position,Movement,Polygon);
		this.RigidBodies = this.WEM.Where(Position,Polygon);
	}
	Update(elapsed) {
		var self = this;
		self.Entities.forEach((entity) => {
			let position = entity.Get(Position);
			let movement = entity.Get(Movement);
            let polygon = self.TransformPolygon(entity.Get(Polygon),position);
			self.RigidBodies.some((rigidBody) => {
                if (rigidBody !== entity) {
                    let rigidPos = rigidBody.Get(Position);
                    let rigidPoly = self.TransformPolygon(rigidBody.Get(Polygon), rigidPos);
					
                    let gjkData = {};

                    // broad phase
                    //if (polygon.AxisAlignedBoundingBox().Intersects(rigidPoly.AxisAlignedBoundingBox())) {


                        // Narrow phase
                        if (Polygon.GjkIntersection(rigidPoly, polygon, gjkData)) {
                            // Collision in progress
                            entity.Get(Polygon).Color = "red";
                            
                            return true;
                        } else {
                            // Not colliding
                            entity.Get(Polygon).Color = "green";

                            let direction = gjkData.d;
                            let distance = direction.Length;
                            direction.Normalize();
                            // find time of impact if exists
                            let velocityBound = movement.Velocity.Dot(direction.Scale(-1)) + movement.AngularVelocity * polygon.Radius;
                            if (velocityBound > 0) {
                                let t = 0;
                                let d = distance;
                                while (Math.abs(d) > 0.05 && t < 1/60) {
                                    let delta = Math.abs(d) / velocityBound;
                                    t += delta;
                                    if (t >= 1/60) break;
                                    d = this.ComputeDistance(rigidPoly, entity, t);
                                }
                                if (t > 0 && t < 1/60) {
                                    MovementSystem.UpdatePosition(position, movement, t);
                                    
                                    entity.Get(Polygon).Color = "yellow";
                                    movement.Velocity.X = 0;
                                    movement.Velocity.Y = 0;
                                } else {
                                    // No collision
                                }
                            }
                        }
                    //}
				}
			});
		});
    }
    TransformPolygon(polygon, position) {
        let copy = polygon.Copy();
        copy.Transform(AffineTransformation(Vector2.Zero, position.Rot, position.Pos));
        return copy;
    }
    ComputeDistance(staticPolygon,dynamicEntity, t) {
        let gjkData = {};
        Polygon.GjkIntersection(staticPolygon, this.TransformPolygon(dynamicEntity.Get(Polygon), MovementSystem.FuturePos(dynamicEntity, t)), gjkData);
        return gjkData.d.length;
    }
}