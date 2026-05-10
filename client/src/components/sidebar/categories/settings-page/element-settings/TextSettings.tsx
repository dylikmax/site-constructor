import { ColorSetting, SizeSetting } from "../base-settings"
import { ChoiceSetting } from "../base-settings/ChoiceSetting"

export const TextSettings = () => {
    return <div className="p-2 flex flex-col gap-4">
        <ColorSetting propName="color" title="Color"/>
        <SizeSetting propName="size" title="Size" from={6} to={72}/>
        <ChoiceSetting title="Align" propName="align" values={['left', 'center', 'right']}/>
    </div>
}