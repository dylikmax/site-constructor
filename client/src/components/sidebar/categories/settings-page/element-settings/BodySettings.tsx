import { useDispatch, useSelector } from "react-redux";
import type { Body } from "../../../../../elements";
import { editElement, type RootState } from "../../../../../redux";
import { ColorSetting } from "../base-settings"

export const BodySettings = () => {
    const element = useSelector((state: RootState) => state.editor.bodyElement) as Body
    const dispatch = useDispatch();
    
    return <div className="p-2 flex flex-col gap-4">
        <ColorSetting 
            prop="backgroundColor" 
            title="Page color"
            handleChange={(newColor: string) => dispatch(editElement({ uuid: element.uuid, background: newColor } as Partial<Body>))}
            color={element.background}
        />
    </div>
}