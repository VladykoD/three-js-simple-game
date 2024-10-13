import { Mesh, MeshBasicMaterial, Scene, SphereGeometry } from 'three';

export class Character {
    private character!: Mesh;

    private readonly originalColor: number = 0x00ff00;

    public constructor(scene: Scene) {
        this.createCharacter(scene);

        window.addEventListener('keydown', this.move.bind(this));
    }

    // TODO: загрузить модельку
    private createCharacter(scene: Scene) {
        const boxGeometry = new SphereGeometry(2, 8, 8);
        const boxMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
        this.character = new Mesh(boxGeometry, boxMaterial);

        this.character.position.x = 0;
        this.character.position.y = -28;
        this.character.position.z = 1;

        scene.add(this.character);
    }

    // TODO: не должен выходить за пределы Plane
    public move(event: KeyboardEvent) {
        const moveDistance = 1;

        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.character.position.y += moveDistance;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.character.position.y -= moveDistance;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.character.position.x += moveDistance;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.character.position.x -= moveDistance;
                break;
        }
    }

    public changeColor(tempColor: number, duration: number) {
        const material = this.character.material as MeshBasicMaterial;
        material.color.set(tempColor);

        setTimeout(() => {
            material.color.set(this.originalColor);
        }, duration);
    }

    public dispose() {
        window.removeEventListener('keydown', this.move.bind(this));
    }

    public getCharacter(): Mesh {
        return this.character;
    }
}
