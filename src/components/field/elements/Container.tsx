import type { Container } from "../../../elements"
import { FieldElement } from "./FieldElement"

interface Props {
    element: Container
}

export const ContainerElement = ({ element } : Props) => {
    return <div 
        className="border-dashed border-2 border-gray-800 p-3 flex flex-col gap-2"
        style={{
            backgroundColor: element.background,
            minHeight: 50
        }}>
            {
                element.content.map(el => <FieldElement element={el}/>)
            }
    </div>
}