import { useEffect, useRef, useState } from 'react';
import css from './App.module.scss';
import { MainScene } from './graphics/MainScene.ts';

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [score, setScore] = useState(10);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const scene = new MainScene(canvas, setScore);

            return () => {
                scene.dispose();
            };
        }
    }, []);

    return (
        <div className={css.wrapper}>
            <div className={css.score}>{score}</div>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default App;
