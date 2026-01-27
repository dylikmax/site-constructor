import { elementIcons } from "../../element-icons"
import { ComponentElement } from "./ComponentElement"

export const Components = () => {
    const components = Object.keys(elementIcons()).map(str => ({ 
        name: str.charAt(0).toUpperCase() + str.slice(1), 
        icon: elementIcons()[str as keyof ReturnType<typeof elementIcons>]
    }));
    return <div className="flex gap-2">
        {components.map((component, i) => <ComponentElement 
            component={component} 
            key={i}/>
        )}
    </div>
}