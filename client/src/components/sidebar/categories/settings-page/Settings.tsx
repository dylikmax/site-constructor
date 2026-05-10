import { useSelector } from "react-redux"
import type { RootState } from "../../../../redux"
import { BodySettings, ContainerSettings, TextSettings } from "./element-settings";

export const Settings = () => {
    const selectedElement = useSelector((state: RootState) => state.editor.selectedElement);
    
    return <div className="flex flex-col gap-2 bg-gray-900 rounded-lg h-full">
        {(() => {switch(selectedElement?.type) {
            case "container":
                return <ContainerSettings/>
            case "text":
                return <TextSettings/>
            default:
                return <BodySettings/>
        }
        })()}
    </div>
}
