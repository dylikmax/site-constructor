import { useSelector } from "react-redux"
import type { RootState } from "../../redux"
import { FieldElement } from "./elements"
import { useEffect, useRef, useState, } from "react";

export const Field = () => {
    const body = useSelector((state: RootState) => state.editor.bodyElement);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1920);

    useEffect(() => {
        const ro = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        if (containerRef.current) {
            ro.observe(containerRef.current);
        }

        return () => ro.disconnect();
    }, []);


    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.transform = `scale(${containerWidth / 1920})`
            canvasRef.current.style.height = `${1080 / (containerWidth / 1920)}px`
        }
        console.log(containerWidth);
        
    }, [containerWidth]);


    return <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden" ref={containerRef}>
        <div 
            ref={canvasRef}            
            style={{
                width: '1920px',
                transformOrigin: 'top left',
                flexShrink: 0,
            }}
        >
            <FieldElement element={body} parentUuid={body.uuid} index={0} />
        </div>
    </div>
}