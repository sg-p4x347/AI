class Game {
	constructor(canvas,input) {
		this.m_input = input;
		this.m_systems = [];
		this.m_runningSystems = [];
		this.WEM = new WorldEntityManager();
		this.m_systems.push(new TerrainSystem(this.WEM));
        this.m_systems.push(new RenderSystem(this.WEM, canvas));
        this.m_systems.push(new PlayerSystem(this.WEM));
        // Physics ==========
        this.m_systems.push(new CollisionSystem(this.WEM));
        this.m_systems.push(new MovementSystem(this.WEM));
        
        //===================
		this.m_viewer = null;
	}
	New() {
		this.m_systems.Find((system) => system instanceof TerrainSystem).Generate();
		this.m_viewer = this.m_systems.Find((system) => system instanceof PlayerSystem).CreatePlayer("blue");
		this.m_systems.Find((system) => system instanceof RenderSystem).m_offset = this.m_viewer.Get(Position).Pos;
	}
	Play() {
		var self = this;
		self.m_runningSystems = [];
		this.m_systems.forEach(function(system) {
			self.m_runningSystems.push(system);
		});
		this.SyncEntities();
	}
	Update(elapsed) {
		let self = this;
		
		if (self.m_viewer) {
			let player = self.m_viewer.Get(Player);
			let controlVec = new Vector2();
			if (self.m_input.up) {
				controlVec.Y += 1;
			}
			if (self.m_input.down) {
				controlVec.Y -= 1;
			}
			if (self.m_input.left) {
				controlVec.X -= 1;
			}
			if (self.m_input.right) {
				controlVec.X += 1;
			}
			controlVec.Normalize();
			if (controlVec.Length) {
				player.Direction = Math.atan2(controlVec.Y,controlVec.X);
			}
			player.Speed = controlVec.Length * 10;
		}
		
		self.m_runningSystems.forEach(system => system.Update(elapsed));
		
		
	}
	SyncEntities() {
		this.m_runningSystems.forEach(system => system.SyncEntities());
	}
}