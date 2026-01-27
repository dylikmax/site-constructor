import { useSelector } from "react-redux"
import type { RootState } from "../../redux"
import { FieldElement } from "./elements"

export const Field = () => {
    const body = useSelector((state: RootState) => state.editor.bodyElement)

    return <div className="w-full">
        <FieldElement element={body} parentUuid={body.uuid} index={0}/>
    </div>
}