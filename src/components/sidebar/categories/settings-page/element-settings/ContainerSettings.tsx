import { ColorSetting } from "../base-settings"

export const ContainerSettings = () => {
    return <div className="p-2">
        <ColorSetting propName="background" title="Background color"/>
    </div>
}