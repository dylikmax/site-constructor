import type { Text } from "../../../elements"

interface Props {
    element: Text
}

export const TextElement = ({ element } : Props) => {
    return <div 
        className="border-dashed border-2 border-gray-800 p-3"
        style={{
            fontSize: element.size,
            color: element.color,
            textAlign: element.align,
        }}>
            {element.content}
    </div>
}