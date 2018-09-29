class RenderSystem extends WorldSystem {
	constructor(wem,canvas) {
		super(wem);
		this.m_canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.m_scaleFactor = 10;
		this.m_offset = new Vector2();
	}
	SyncEntities() {
		this.Entities = this.WEM.Where(Position,Polygon);
	}
	Update(elapsed) {
		var self = this;
		
		this.ctx.clearRect(0,0,canvas.width,canvas.height);
		this.ctx.strokeStyle = "white";
		
		this.Entities.forEach((entity) => {
			let pos = entity.Get(Position);
			let polygon = entity.Get(Polygon);
			self.ctx.fillStyle = polygon.Color;
			self.ctx.beginPath();
			polygon.Vertices.forEach((vertex,i) => {
				let vertexPrime = this.Rotate(vertex,pos.Rot);
				if (i === 0) {
					self.ctx.moveTo(self.TransformX(vertexPrime.X + pos.Pos.X),self.TransformY(vertexPrime.Y + pos.Pos.Y));
				} else {
					self.ctx.lineTo(self.TransformX(vertexPrime.X + pos.Pos.X),self.TransformY(vertexPrime.Y + pos.Pos.Y));
				}
			});
			self.ctx.closePath();
			
			self.ctx.fill();
			self.ctx.stroke();
			
			
		});
	}
	TransformX(unit) {
		return (unit - this.m_offset.X) * this.m_scaleFactor + self.canvas.width / 2;
	}
	TransformY(unit) {
		return (unit - this.m_offset.Y) * -this.m_scaleFactor + self.canvas.height / 2;
	}
	Rotate(point,angle) {
		return new Vector2(Math.cos(angle) * point.X - Math.sin(angle) * point.Y,Math.sin(angle) * point.X + Math.cos(angle) * point.Y);
	}
} 