import { useDispatch } from "react-redux";
import type { Body } from "../../../elements"
import { FieldElement } from "./FieldElement"
import { selectElement } from "../../../redux/slices/editor.slice";

interface Props {
    element: Body;
}

export const BodyElement = ({ element } : Props) => {
    const dispatch = useDispatch()

    const handleClick = () => dispatch(selectElement(null));
    
    return <div 
        className="h-full overflow-y-auto flex flex-col gap-2"
        style={{
            backgroundColor: element.background
        }}
        onClick={handleClick}
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