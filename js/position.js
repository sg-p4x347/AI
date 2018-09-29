class Position extends WorldComponent {
	constructor(pos,rot) {
		super();
		this.Pos = pos ? pos : new Vector2();
		this.Rot = rot ? rot : 0;
	}
	get Mask() {
		return Position.Mask;
	}
}
Position.Mask = Math.pow(2,WorldComponent.Mask++);