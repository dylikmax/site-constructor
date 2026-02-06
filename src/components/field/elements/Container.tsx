import type { Container } from "../../../elements"
import { FieldElement } from "./FieldElement"

interface Props {
    element: Container
}

export const ContainerElement = ({ element } : Props) => {
    return <div 
        className="p-3 flex flex-col gap-2"
        style={{
            backgroundColor: element.background,
            minHeight: 50
        }}
        >
        {
            element.content.map((el, i) => <FieldElement 
                element={el} 
                key={el.uuid}
                parentUuid={element.uuid}
                index={i}
            />)
        }
    </div>
}