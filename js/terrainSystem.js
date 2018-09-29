class TerrainSystem extends WorldSystem {
	constructor(wem) {
		super(wem);
		
	}
	SyncEntities() {
		this.Entities = this.WEM.Where(Position,Polygon);
	}
	Generate() {
		let verticalWall = new Polygon([
			new Vector2(0.5,32),
			new Vector2(-0.5,32),
			new Vector2(-0.5,-32),
			new Vector2(0.5,-32)
		]);
		
		let horizontalWall = new Polygon([
			new Vector2(-32,0.5),
			new Vector2(-32,-0.5),
			new Vector2(32,-0.5),
			new Vector2(32,0.5)
		]);
		this.WEM.NewEntity([
			new Position(new Vector2(-32,0)),
			verticalWall
		]);
		this.WEM.NewEntity([
			new Position(new Vector2(32,0)),
			verticalWall
		]);
		this.WEM.NewEntity([
			new Position(new Vector2(0,-32)),
			horizontalWall
		]);
		this.WEM.NewEntity([
			new Position(new Vector2(0,32)),
			horizontalWall
		]);
	}
}