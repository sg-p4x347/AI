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
			let position = entity.Get(Position);
			let movement = entity.Get(Movement);
			position.Pos.X += movement.Velocity.X * elapsed;
			position.Pos.Y += movement.Velocity.Y * elapsed;
		});
	}
	
}