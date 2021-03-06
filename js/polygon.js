class BoundingBox {
    constructor(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }
    Contains(point) {
        return point.X >= this.minX && point.X <= this.maxX && point.Y >= this.minY && point.Y <= this.maxY;
    }
    Intersects(b) {
        return (this.minX < b.maxX && this.maxX > b.minX && this.minY < b.maxY && this.maxY > b.minY);
    }
	Copy() {
		return new BoundingBox(this.minX,this.maxX,this.minY,this.maxY);
	}
}
class Polygon extends WorldComponent {
	constructor(vertices,color) {
		super();
		this.Vertices = vertices ? vertices : [];
		this.Color = color ? color : "white";
	}
	get Mask() {
		return Polygon.Mask;
	}
	Copy() {
		let copy = new Polygon(this.Vertices.Select((vertex) => vertex.Copy()),this.Color);
		if (this.boundingBox) copy.boundingBox = this.boundingBox.Copy();
		return copy;
	}
	Area() {
        var sum = 0;
        var n = this.Vertices.length;
        for (var i = 0; i < n; i++) {
            sum += this.Vertices[i].X * this.Vertices[(i + 1) % n].Y - this.Vertices[(i + 1) % n].X * this.Vertices[i].Y;
        }
        return sum * 0.5;
    }
    Center() {
        var n = this.Vertices.length;
        var x = 0;
        
        for (var i = 0; i < n; i++) {
            x += (this.Vertices[i].X + this.Vertices[(i + 1) % n].X) * (this.Vertices[i].X * this.Vertices[(i + 1) % n].Y - this.Vertices[(i + 1) % n].X * this.Vertices[i].Y);
        }
        var y = 0;
        for (var i = 0; i < this.Vertices.length; i++) {
            y += (this.Vertices[i].Y + this.Vertices[(i + 1) % n].Y) * (this.Vertices[i].X * this.Vertices[(i + 1) % n].Y - this.Vertices[(i + 1) % n].X * this.Vertices[i].Y);
        }
        var sixthArea = 1 / (6 * this.Area());
        return new Vector2(x * sixthArea, y * sixthArea);
    }
    get Radius() {
        let center = this.Center();
        return this.Vertices.Max((vertex) => Vector2.Distance(vertex, center));
    }
    Transform(matrix) {
        this.Vertices.forEach(function (vertex) {
            vertex.Transform(matrix);
        });
		this.GeometryChanged();
    }
    Edges() {
        var self = this;
        var edges = [];
        self.Vertices.forEach(function (vertex, index) {
            edges.push(new Segment(vertex, self.Vertices[(index + 1) % self.Vertices.length]));
        });
        return edges;
    }
    Normals() {
        var self = this;
        try {
            var normals = [];
            self.Vertices.forEach(function (vertex, index) {
                normals.push(self.Vertices[(index + 1) % self.Vertices.length].Subtract(vertex).Normal());
            });
        } catch (ex) {
            var test = 0;
        }
        return normals;
    }
    GeometryChanged() {
        this.boundingBox = undefined;
    }
    AxisAlignedBoundingBox() {
        if (this.boundingBox) return this.boundingBox;
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        this.Vertices.forEach(function (vertex) {
            minX = Math.min(vertex.X, minX);
            minY = math.min(vertex.Y, minY);
            maxX = Math.max(vertex.X, maxX);
            maxY = Math.max(vertex.Y, maxY);
        });
        this.boundingBox = new BoundingBox(minX, maxX, minY, maxY);
        return this.boundingBox;
    }
    Project(axis) {
        var min = Number.POSITIVE_INFINITY;
        var max = Number.NEGATIVE_INFINITY;
        this.Vertices.forEach(function (vertex) {
            var p = axis.Dot(vertex);
            min = Math.min(p, min);
            max = Math.max(p, max);
        });
        return { min: min, max: max };
    }
    Intersects(b) {
        // broad phase
        if (this.AxisAlignedBoundingBox().Intersects(b.AxisAlignedBoundingBox())) {
            // narrow phase
            return Polygon.SAT(this, b) && Polygon.SAT(b, this);
        }
    }
    ContainsPoint(vector) {
        var self = this;
        var axes = this.Normals();
        return !axes.some(function (axis) {
            var projectionA = self.Project(axis);
            var dot = axis.Dot(vector);
            var projectionB = { min: dot, max: dot };
            if (projectionA.min > projectionB.max || projectionB.min > projectionA.max) {
                return true;
            }
        });
    }
    static SAT(a, b) {
        var axes = a.Normals();
        return !axes.some(function (axis) {
            var projectionA = a.Project(axis);
            var projectionB = b.Project(axis);
            if (projectionA.min > projectionB.max || projectionB.min > projectionA.max) {
                return true;
            }
        });
    }
    Intersections(polygons) {
        var self = this;
        var results = [];
        polygons.forEach(function (polygon) {
            if (self.Intersects(polygon)) {
                results.push(polygon);
            }
        });
        return results;
    }
    AnyIntersections(polygons) {
        var self = this;
        return polygons.some(function (polygon) {
            if (self.Intersects(polygon))
                return true;
        });
    }

    static GjkIntersection(a, b, params) {
        let initialAxis = new Vector2(0, 1);
        params = params ? params : {};
        let A = Polygon.Support(a, initialAxis).Subtract(Polygon.Support(b, initialAxis.Scale(-1)));
        params.s = [A.Copy()];
        params.d = A.Copy().Scale(-1);
        while (true) {
            A = Polygon.Support(a, params.d).Subtract(Polygon.Support(b, params.d.Scale(-1)));
            if (A.Dot(params.d) < 0) {
                return false;
            }
            params.s.push(A.Copy());
            if (Polygon.NearestSimplex(params)) {
                return true;
            }
        }
    }
    static Support(polygon, d) {
        let maxIndex = null;
        let max = -Infinity;
        polygon.Vertices.forEach((v,i) => {
            let value = v.Dot(d);
            if (maxIndex === null || value > max) {
                max = value;
                maxIndex = i;
            }
        });
        return polygon.Vertices[maxIndex];
    }
    static NearestSimplex(params) {
        let aO = params.s[params.s.length - 1].Scale(-1);
        if (params.s.length === 2) {
            let a = params.s[1];
            let b = params.s[0];
            let ab = b.Subtract(a);

            if (ab.Dot(aO) > 0) {
                let normal = ab.Normal();
                if (normal.Dot(aO) > 0) {
                    params.d = normal.Scale(Math.abs(aO.Cross(ab) / ab.Length));
                } else {
                    params.d = normal.Scale(-Math.abs(aO.Cross(ab) / ab.Length));
                }
                
                return false;
            } else {
                params.s = [a];
                params.d = aO;
                return false;
            }
        } else if (params.s.length === 3) {
            let a = params.s[2];
            let b = params.s[1];
            let c = params.s[0];

            let ab = b.Subtract(a);
            let ac = c.Subtract(a);

            let direction = ac.Normal().Scale(Math.abs(aO.Cross(ac) / ac.Length));

            if (direction.Dot(aO) > 0) {

                if (ac.Dot(aO) > 0) {
                    params.s = [c, a];
                    params.d = direction;
                    return false;
                }
            }
            direction = ab.Normal().Scale(-Math.abs(aO.Cross(ac) / ac.Length));
            if (direction.Dot(aO) > 0) {
                if (ab.Dot(aO) > 0) {
                    params.s = [b, a];
                    params.d = direction;
                    return false;
                } else {
                    params.s = [a];
                    params.d = aO;
                    return false;
                }
            } else {
                return true;
            }
        }
    }
    static ClosestPoint(a, b) {
        let d1 = b.Subtract(a).Dot(a);
        let d2 = a.Subtract(b).Dot(a);
        let dX = d1 + d2;

        return a.Scale(d1).Add(b.Scale(d2)).Scale(1 / dX);

    }
}
Polygon.Mask = Math.pow(2,WorldComponent.Mask++);