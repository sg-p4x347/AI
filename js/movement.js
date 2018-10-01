class Movement extends WorldComponent {
	constructor(velocity) {
		super();
        this.Velocity = velocity ? velocity : new Vector2();
        this.AngularVelocity = 0;
	}
	get Mask() {
		return Movement.Mask;
	}
}
Movement.Mask = Math.pow(2,WorldComponent.Mask++);