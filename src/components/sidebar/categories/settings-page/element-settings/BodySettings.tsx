import { ColorSetting } from "../base-settings"

export const BodySettings = () => {
    return <div className="p-2">
        <ColorSetting propName="background" title="Page color"/>
    </div>
}