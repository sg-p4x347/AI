class Entity {
	constructor(id,components) {
		this.m_id = id;
		this.m_signature = 0;
		this.Components = {};
		components.forEach((component) => this.AddComponent(component));
	}
	get ID() {
		return this.m_id;
	}
	get Signature() {
		return this.m_signature;
	}
	AddComponent(component) {
		if (!component) console.log(`${id}-${this.getTypeName()} - component is ${component}`);
		component.Entity = this;
		this.Components[component.Mask] = component;
		this.m_signature += component.Mask;
	}
	Get(compType) {
		return this.Components[compType.Mask];
	}
		
}