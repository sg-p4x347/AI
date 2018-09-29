class WorldComponent {
	constructor() {
		this.Entity = null;
	}
	get ID() {
		return this.Entity.ID;
	}
}
// a mapping of world components;
WorldComponent.Mask = 0;