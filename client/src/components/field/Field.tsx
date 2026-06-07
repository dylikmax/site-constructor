import { useSelector } from "react-redux"
import type { RootState } from "../../redux"
import { FieldElement } from "./elements"
import { useEffect, useRef } from "react";

export const Field = () => {
    const body = useSelector((state: RootState) => state.editor.bodyElement);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        
        if (!container || !canvas) return;

        const ro = new ResizeObserver(() => {
            const width = container.clientWidth;

            const scale = Math.max(0.01, width / 1920);
            canvas.style.transform = `scale(${scale})`;

            const visualHeight = canvas.getBoundingClientRect().height;
            const layoutHeight = visualHeight / scale;
            const gap = layoutHeight - visualHeight;
            canvas.style.marginBottom = `-${gap}px`;
        });

        ro.observe(container);
        ro.observe(canvas);
        return () => ro.disconnect();
    }, []);

    return <div 
        className="flex-1 min-w-0 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden relative"
        ref={containerRef}
        style={{
            backgroundColor: body.background
        }}
    >
            <div 
                ref={canvasRef}
                className="flex flex-col"   
                style={{
                    width: 1920,
                    transformOrigin: 'top left',
                    flexShrink: 0,
                    minHeight: '100%',
                    backgroundColor: body.background
                }}
            >
                <FieldElement element={body} parentUuid={body.uuid} index={0} />
            </div>
    </div>
}