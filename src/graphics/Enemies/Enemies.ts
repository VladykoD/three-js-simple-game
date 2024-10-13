import { Mesh, MeshBasicMaterial, Scene, SphereGeometry } from 'three';

export class Enemies {
    private readonly enemiesArray: Mesh[] = [];

    private readonly directions: { x: number; y: number }[] = [];

    public constructor(scene: Scene) {
        this.createCubes(scene);
    }

    private createCubes(scene: Scene) {
        const cubeGeometry = new SphereGeometry(1, 4, 4);
        const cubeMaterial = new MeshBasicMaterial({ color: 0xff0000 });

        for (let i = 0; i < 18; i++) {
            const cube = new Mesh(cubeGeometry, cubeMaterial);
            this.setPositions(cube);
            scene.add(cube);
            this.enemiesArray.push(cube);

            this.directions.push(this.getRandomDirection());
        }
    }

    private setPositions(enemy: Mesh) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;

        enemy.position.set(x, y, 1);
    }

    private getRandomDirection() {
        const angle = Math.random() * Math.PI * 2; // Случайный угол в радианах

        return {
            x: Math.cos(angle),
            y: Math.sin(angle),
        };
    }

    public updatePositions() {
        const moveDistance = 0.08;

        for (let i = 0; i < this.enemiesArray.length; i++) {
            const enemy = this.enemiesArray[i];
            const direction = this.directions[i];

            enemy.position.x += direction.x * moveDistance;
            enemy.position.y += direction.y * moveDistance;

            if (
                enemy.position.x >= 25 ||
                enemy.position.x <= -25 ||
                enemy.position.y >= 25 ||
                enemy.position.y <= -25
            ) {
                this.setPositions(enemy);
                this.directions[i] = this.getRandomDirection();
            }
        }
    }

    public getCubes(): Mesh[] {
        return this.enemiesArray;
    }
}
