// initial translation [ti], angle [a],scale [s], final translation [tf]
function AffineTransformation(ti,a, tf, s) {
    s = s ? s : new Vector2(1, 1);
    tf = tf ? tf : Vector2.Zero;
    let sinA = Math.sin(a);
    let cosA = Math.cos(a);
    return math.matrix([
        [s.X * cosA, -s.Y * sinA,  ti.X * s.X * cosA - ti.Y * s.Y * sinA + tf.X],
        [s.X * sinA, s.Y * cosA,  ti.X * s.X * sinA +  ti.Y * s.Y * cosA + tf.Y],
        [0, 0, 1]
    ]);
}
class Vector2 {
	constructor(x,y) {
		this.X = x ? x : 0;
		this.Y = y ? y : 0;
	}
	get Length() {
		return Math.sqrt(this.X * this.X + this.Y * this.Y);
	}
	Normalize() {
		let length = this.Length;
		if (length !== 0) {
			this.X /= length;
			this.Y /= length;
		}
	}
	Dot(b) {
        return (this.X * b.X + this.Y * b.Y);
    }
    Scale(scalar) {
        return new Vector2(this.X * scalar, this.Y * scalar);
    }
    Add(b) {
        return new Vector2(this.X + b.X, this.Y + b.Y);
    }
    Subtract(b) {
        return new Vector2(this.X - b.X, this.Y - b.Y);
    }
    Normal() {
        var normal = new Vector2(this.Y, -this.X);
        normal.Normalize();
        return normal;
    }
    Transform(matrix) {
        var result = math.multiply(matrix, [this.X, this.Y,1]);
        this.X = result._data[0];
        this.Y = result._data[1];
    }
    Equals(b) {
        return this.X == b.X && this.Y == b.Y;
    }
	Copy() {
		return new Vector2(this.X,this.Y);
	}
    static Distance(a, b) {
        return Math.sqrt((a.X - b.X) * (a.X - b.X) + (a.Y - b.Y) * (a.Y - b.Y));
    }
    static Angle(v1, v2) {
        var a = new Vector2(v1);
        a.Normalize();
        var b = new Vector2(v2);
        b.Normalize();

        return Math.acos(a.Dot(b));
    }
	
}
Vector2.Zero = new Vector2();