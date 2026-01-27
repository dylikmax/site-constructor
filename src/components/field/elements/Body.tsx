import type { Body } from "../../../elements"
import { FieldElement } from "./FieldElement"

interface Props {
    element: Body
}

export const BodyElement = ({ element } : Props) => {
    console.log(element);
    
    return <div 
        className="h-full flex flex-col gap-2"
        style={{
            backgroundColor: element.background
        }}>
            {
                element.content.map(el => <FieldElement element={el}/>)
            }
    </div>
}