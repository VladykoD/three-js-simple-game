import { BoxGeometry, Mesh, MeshBasicMaterial, Scene } from 'three';

export class Decorations {
    private readonly decorationsArray: Mesh[] = []; // здесь лежат наши декорации

    public constructor(scene: Scene) {
        this.createDecorations(scene);
    }

    // TODO: загрузить модельки
    private createDecorations(scene: Scene) {
        const cubeGeometry = new BoxGeometry(2, 2, 2);
        const cubeMaterial = new MeshBasicMaterial({ color: 0xeaeaea });

        for (let i = 0; i < 20; i++) {
            const cube = new Mesh(cubeGeometry, cubeMaterial);
            this.positionRandomly(cube);
            scene.add(cube);
            this.decorationsArray.push(cube);
        }
    }

    private positionRandomly(decoration: Mesh) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;

        decoration.position.set(x, y, 1);
    }

    public getDecorations(): Mesh[] {
        return this.decorationsArray;
    }
}
