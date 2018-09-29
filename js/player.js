class Player extends WorldComponent {
	
		
	constructor() {
		super();
		// radians
		this.Direction = 0;
		// enum
		this.Action = null;
		// movement speed
		this.Speed = 0;
	}
	get Mask() {
		return Player.Mask;
	}
		
}
Player.Mask = Math.pow(2,WorldComponent.Mask++);

Player.Actions = {
	Eat:0,
	Attack:1,
	Mate:2
}