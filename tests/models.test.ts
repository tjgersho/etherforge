import {Rect, Point, Circle} from '../src/models';

describe('Class Rect', () => {

    describe('constructor', () => {
        const x = 10, y = 20, w = 30, h = 40;
        const rect = new Rect(x, y, w, h);

        test('sets attribute x', () => {
            expect(rect.x).toBe(x);
        });

        test('sets attribute y', () => {
            expect(rect.y).toBe(y);
        });

        test('sets attribute w', () => {
            expect(rect.width).toBe(w);
        });

        test('sets attribute h', () => {
            expect(rect.height).toBe(h);
        });

    });

    describe('method contains', () => {
        const x = 50, y = 100, w = 25, h = 30, data = 'some stuff';
        const left = x, right = x + w, top = y, bottom = y + h;

        let rect: Rect;

        beforeEach(() => {
            rect = new Rect(x, y, w, h);
        });

        const points: any[] = [
            [new Point(x, y), true],
            [new Point(x, top), true],
            [new Point(x, top - 1), false],
            [new Point(x, bottom), true],
            [new Point(x, bottom + 1), false],
            [new Point(left, y),  true],
            [new Point(left - 1, y),  false],
            [new Point(right, y),  true],
            [new Point(right + 1, y), false],
        ];

        points.forEach(point => {
            test(`returns (${point[0].x}, ${point[0].y})`, () => {
                expect(rect.contains(point[0])).toEqual(point[1]);
            });
        });
    });

    describe('method intersects', () => {
        const x = 50, y = 100, w = 25, h = 30, data = 'some stuff';

        let rect: Rect;

        beforeEach(() => {
            rect = new Rect(x, y, w, h);
        });

        const Rectes: any[] = [
            [new Rect(1000, 2000, 3000, 4000), false],
            [new Rect(5000, 100, 10, 12), false],
            [new Rect(75, 1000, 12, 10), false],
            [new Rect(60, 110, 13, 11), true],
            [new Rect(0, 0, 1000, 2000), true],
            [new Rect(0, 0, 60, 110), true],
            [new Rect(50, 100, 1, 1), true]

        ];

        Rectes.forEach(range => {
            test(`(x:${range[0].x}, y:${range[0].y}, w:${range[0].width}, h:${range[0].height})`, () => {
                expect(rect.intersects(range[0])).toEqual(range[1]);
            });
        });
    });
});


 
function rand(max: number, min = 0): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

describe('Class Circle', () => {

    describe('constructor', () => {
        const x = 10, y = 20, r = 30;
        const circle = new Circle(x, y, r );

        test('sets attribute x', () => {
            expect(circle.x).toBe(x);
        });

        test('sets attribute y', () => {
            expect(circle.y).toBe(y);
        });

        test('sets attribute r', () => {
            expect(circle.r).toBe(r);
        });

        test('sets attribute rPow2', () => {
            expect(circle.rPow2).toBe(r * r);
        });

    });

    describe('method contains', () => {
        const x = rand(1000), y = rand(1000), r = rand(1000);
        let circle: Circle;

        beforeEach(() => {
            circle = new Circle(x, y, r);
        });

        const points: any[] = [
            [new Point(x, y), true],
            [new Point(x, y - r), true],
            [new Point(x, y - r - 1), false],
            [new Point(x, y + r), true],
            [new Point(x, y + r + 1), false],
            [new Point(x - r, y), true],
            [new Point(x - r - 1, y), false],
            [new Point(x + r, y), true],
            [new Point(x + r + 1, y), false]
        ];

        points.forEach(point => {
            test(`(${point[0].x}, ${point[0].y})`, () => {
                expect(circle.contains(point[0])).toEqual(point[1]);
            });
        });

    });

    describe('method intersects', () => {
        const x = 100, y = 50, r = 25;
        let circle: Circle;

        beforeEach(() => {
            circle = new Circle(x, y, r);
        });

        const Rectes: any[] = [
            [new Rect(10000, 2000, 100, 200), false],
            [new Rect(1000, y, 12, 10), false],
            [new Rect(x, 1000, 12, 10), false],
            [new Rect(x, y, 12, 10), true],
            [new Rect(x, y, r * 2, r * 2), true],
            [new Rect(x + 8, 50, 7, 10), true],
            [new Rect(x + 24, y + 24, 1, 1,), false],
            [new Rect(x, y + r, 1, 1),  true]

        ];

        Rectes.forEach(r => {
            test(`(x:${r[0].x}, y:${r[0].y}, w:${r[0].width}, h:${r[0].height})`, () => {
                expect(circle.intersects(r[0])).toEqual(r[1]);
            });
        });
    });
});



describe('Class Point', () => {

    describe('constructor', () => {
        const x = 10, y = 20, data = 'some stuff';
        const point = new Point(x, y);

        test('sets attribute x', () => {
            expect(point.x).toBe(x);
        });

        test('sets attribute y', () => {
            expect(point.y).toBe(y);
        });

    });
});