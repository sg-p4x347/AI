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
			let polygon = entity.Get(Polygon).Copy();
			polygon.Transform(AffineTransformation(Vector2.Zero,position.Rot,position.Pos));
			self.RigidBodies.some((rigidBody) => {
				if (rigidBody != entity) {
					let rigidPoly = rigidBody.Get(Polygon).Copy();
					let rigidPos = rigidBody.Get(Position);
					rigidPoly.Transform(AffineTransformation(Vector2.Zero,rigidPos.Rot,rigidPos.Pos));
					if (rigidPoly.Intersects(polygon)) {
						entity.Get(Polygon).Color = "red";
						// correct position by negating the last time-step movement
						position.Pos.X -= movement.Velocity.X * elapsed;
						position.Pos.Y -= movement.Velocity.Y * elapsed;
						return true;
					} else {
						entity.Get(Polygon).Color = "green";
					}
				}
			});
		});
	}
	
}