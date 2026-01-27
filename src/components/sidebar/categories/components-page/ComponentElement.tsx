import type { ReactElement } from "react";
interface Props {
    component: {
        name: string;
        icon: ReactElement
    }
}

export const ComponentElement = ({ component } : Props) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.dataTransfer.setData('application/components', component.name.toLowerCase());
    }

    return <div className="bg-gray-900 p-3 flex flex-col items-center w-20 rounded-lg gap-2"
            draggable
            onDragStart={handleDragStart}
        >
        {component.icon}
        <p className="text-xs">{component.name}</p>
    </div>
}