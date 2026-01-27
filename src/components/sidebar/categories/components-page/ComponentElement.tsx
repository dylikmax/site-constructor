import type { ReactElement } from "react";
interface Props {
    component: {
        name: string;
        icon: ReactElement
    }
}

export const ComponentElement = ({ component } : Props) => {
    return <div className="bg-gray-900 p-3 flex flex-col items-center w-20 rounded-lg gap-2"
            draggable>
        {component.icon}
        <p className="text-xs">{component.name}</p>
    </div>
}