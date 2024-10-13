import {
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FrameHandler } from '../helpers/FrameHandler';
import { Character } from './Character/Character.ts';
import { Decorations } from './Decorations/Decorations.ts';
import { Enemies } from './Enemies/Enemies.ts';

export class MainScene {
    private readonly canvas: HTMLCanvasElement;

    private readonly resizeObserver: ResizeObserver;

    private readonly renderer: WebGLRenderer;

    private readonly camera: PerspectiveCamera;

    private readonly scene: Scene;

    private readonly frameHandler: FrameHandler;

    private readonly controls: OrbitControls;

    private readonly character: Character;

    // @ts-ignore
    private readonly decorations: Decorations;

    private readonly enemies: Enemies;

    private scenePlane!: Mesh;

    private score: number = 10;

    private readonly updateScoreCallback: (score: number) => void;

    public constructor(canvas: HTMLCanvasElement, updateScoreCallback: (score: number) => void) {
        this.canvas = canvas;
        this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        this.camera.position.set(0, -10, 50);
        this.scene = new Scene();

        this.updateScoreCallback = updateScoreCallback;
        this.updateScoreCallback(this.score);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.character = new Character(this.scene);
        this.decorations = new Decorations(this.scene);
        this.enemies = new Enemies(this.scene);

        this.createScene(this.scene);

        this.update = this.update.bind(this);
        this.resize = this.resize.bind(this);
        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(this.canvas);
        this.frameHandler = new FrameHandler(this.update);
        this.resize();
        this.frameHandler.start();
    }

    /**
     * Создаём сцену
     */
    private createScene(scene: Scene) {
        const planeGeometry = new PlaneGeometry(50, 50);
        const planeMaterial = new MeshBasicMaterial({ color: 0xffffff, side: 2 });

        this.scenePlane = new Mesh(planeGeometry, planeMaterial);
        scene.add(this.scenePlane);
    }

    /**
     * Update logic
     */
    private update(_delta: number) {
        this.enemies.updatePositions();

        // Check for collisions
        if (this.checkCollisions()) {
            if (this.score > 0) {
                this.score--;
                this.updateScoreCallback(this.score);
            }
        }

        this.controls.update();
        this.render();
    }

    private checkCollisions(): boolean {
        const characterPosition = this.character.getCharacter().position;

        for (const enemy of this.enemies.getCubes()) {
            if (this.isColliding(characterPosition, enemy.position)) {
                enemy.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, 1);
                this.character.changeColor(0xff69b4, 300);

                return true;
            }
        }

        return false;
    }

    /**
     * Simple AABB collision detection
     */
    private isColliding(pos1: Vector3, pos2: Vector3): boolean {
        const distanceX = Math.abs(pos1.x - pos2.x);
        const distanceY = Math.abs(pos1.y - pos2.y);

        return distanceX < 3 && distanceY < 3;
    }

    /**
     * Update render
     */
    private render() {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Update on resize
     */
    private resize() {
        const { width, height } = this.canvas.getBoundingClientRect();
        const dpi = window.devicePixelRatio;
        const w = width * dpi;
        const h = height * dpi;

        this.canvas.width = w;
        this.canvas.height = h;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h, false);
    }

    /**
     * Clear
     */
    public dispose() {
        this.character.dispose();

        this.resizeObserver.disconnect();
        this.frameHandler.stop();
    }
}
