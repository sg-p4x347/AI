class PlayerSystem extends WorldSystem {
	constructor(wem) {
		super(wem);
	}
	SyncEntities() {
		this.Entities = this.WEM.Where(Position,Player,Movement);
	}
	Update(elapsed) {
		
		var self = this;
		self.Entities.forEach((entity) => {
			let player = entity.Get(Player);
			let movement = entity.Get(Movement);
			let position = entity.Get(Position);
			movement.Velocity.X = Math.cos(player.Direction) * player.Speed;
			movement.Velocity.Y = Math.sin(player.Direction) * player.Speed;
			position.Rot = player.Direction;
		});
	}
	CreatePlayer(color) {
		return this.WEM.NewEntity([
			new Position(),
			new Movement(),
			new Player(),
			new Polygon([
				new Vector2(0.5,0),
				new Vector2(-0.25,0.25),
				new Vector2(-0.25,-0.25)
			],color)
		]);
	}
}