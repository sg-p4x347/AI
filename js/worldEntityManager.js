class WorldEntityManager {
	constructor() {
		this.m_nextEntityID = 1;
		this.m_entities = [];
	}
	NewEntity(components) {
		if (!components) console.log("NewEntity has invalid components");
		let entity = new Entity(this.m_nextEntityID++,components);
		this.m_entities.push(entity);
		return entity;
	}
	Where(...compTypes) {
		let entities = [];
		let querySig = compTypes.reduce((previous, current) => {
			return {Mask:(previous.Mask | current.Mask)};
		}).Mask;
		this.m_entities.Where((entity) => {
			return ((entity.Signature & querySig) == querySig);
		}).forEach((entity) => entities.push(entity));
		return entities;
	}
}