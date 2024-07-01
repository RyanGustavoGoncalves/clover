/**
 * Componente Terminal com Rolagem Arrastável
 * @see https://v0.dev/t/aK0hEKltQpA
 * Documentação: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState, useEffect, useRef } from 'react';

export default function Terminal({ output }) {
    const [outputLines, setOutputLines] = useState([]);

    useEffect(() => {
        if (output) {
            const linesToAdd = output.trim().split('\n');
            setOutputLines(prevLines => [...prevLines, ...linesToAdd]);
        }
    }, [output]);


    return (
        <div
            className="flex flex-col h-full bg-background text-foreground"
        >
            {/* Área do terminal para mostrar a saída */}
            <div
                className="flex-1 overflow-auto px-4 py-2"
            >
                {outputLines.map((line, index) => (
                    <div key={index} className="text-sm">
                        <span>{line}</span>
                    </div>
                ))}
            </div>

            {/* Prompt $ */}
            <div className="px-4 py-2 border-t border-border">
                <span className="text-muted-foreground">$ </span>
            </div>
        </div>
    );
}
