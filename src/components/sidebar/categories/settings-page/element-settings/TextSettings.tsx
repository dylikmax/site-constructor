import { ColorSetting, SizeSetting } from "../base-settings"

export const TextSettings = () => {
    return <div className="p-2 flex flex-col gap-4">
        <ColorSetting propName="color" title="Color"/>
        <SizeSetting propName="size" title="Size" from={6} to={72}/>
    </div>
}