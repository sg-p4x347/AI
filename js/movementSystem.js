class MovementSystem extends WorldSystem {
	constructor(wem) {
		super(wem);
	}
	SyncEntities() {
		this.Entities = this.WEM.Where(Position,Movement);
	}
	Update(elapsed) {
		var self = this;
		self.Entities.forEach((entity) => {
            MovementSystem.UpdatePosition(entity.Get(Position),entity.Get(Movement), elapsed);
		});
	}
    static UpdatePosition(position,movement,elapsed) {
        position.Pos.X += movement.Velocity.X * elapsed;
        position.Pos.Y += movement.Velocity.Y * elapsed;
        position.Rot += movement.AngularVelocity * elapsed;
    }
    static FuturePos(entity, elapsed) {
        let position = entity.Get(Position).Copy();
        MovementSystem.UpdatePosition(position, entity.Get(Movement), elapsed);
        return position;
    }
}