import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../../../redux"
import { BodySettings, ContainerSettings, TextSettings } from "./element-settings";
import { closeModal } from "../../../../redux/slices/editor.slice";

export const Settings = () => {
    const selectedElement = useSelector((state: RootState) => state.editor.selectedElement);
    
    const dispatch = useDispatch();

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if(e.currentTarget === e.target) {
            dispatch(closeModal());
        }
    }
    
    return <div 
        className="flex flex-col gap-2 bg-gray-900 rounded-lg h-full"
        onClick={handleClick}
    >
        {(() => {switch(selectedElement?.type) {
            case "container":
                return <ContainerSettings/>
            case "text":
                return <TextSettings key={selectedElement.uuid}/>
            default:
                return <BodySettings/>
        }
        })()}
    </div>
}
