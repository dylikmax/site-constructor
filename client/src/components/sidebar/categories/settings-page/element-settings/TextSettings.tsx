import { useDispatch, useSelector } from "react-redux"
import { ColorSetting, SizeSetting } from "../base-settings"
import { ChoiceSetting } from "../base-settings/ChoiceSetting"
import { editElement, type RootState } from "../../../../../redux"
import type { Text } from "../../../../../elements"
import { useState } from "react"
import { closeModal } from "../../../../../redux/slices/editor.slice"
import type { SettingChoice } from "../../../../../types"
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from "../../../../../assets/icons"

const avaliableSizes = [10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 72]
const alignments: SettingChoice<string>[] = [{
    id: 1,
    value: "left",
    visual: <AlignLeftIcon size={25} color="white"/>
}, {
    id: 2,
    value: "center",
    visual: <AlignCenterIcon size={25} color="white"/>
},{
    id: 3,
    value: "right",
    visual: <AlignRightIcon size={25} color="white"/>
}, {
    id: 4,
    value: "justify",
    visual: <AlignJustifyIcon size={25} color="white"/>
}]

export const TextSettings = () => {
    const element = useSelector((state: RootState) => state.editor.selectedElement || state.editor.bodyElement) as Text
    const dispatch = useDispatch();

    const [inputSize, setInputSize] = useState(String(element.size));
        
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSize(e.target.value);
    }

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        if (Number.isNaN(value)) {
            setInputSize(String(element.size));
            return;
        }

        setInputSize(String(value));
        dispatch(editElement({ uuid: element.uuid, size: value } as Partial<Text>))
    }
    
    const handleMenuClick = (value: number) => () => {
        setInputSize(String(value));
        dispatch(editElement({ uuid: element.uuid, size: value } as Partial<Text>));
        dispatch(closeModal());
    }

    const handleAlignClick = (choice: SettingChoice<string>) => () => {
        dispatch(editElement({ uuid: element.uuid, align: choice.value } as Partial<Text>));
    };

    return <div className="p-2 flex flex-col gap-4">
        <ColorSetting 
            title="Color"
            color={element.color}
            handleChange={(newColor: string) => dispatch(editElement({ uuid: element.uuid, color: newColor } as Partial<Text>))}
            prop="color"
        />
        <SizeSetting 
            prop="size" 
            title="Size"
            size={+inputSize}
            dropdownValues={avaliableSizes}
            handleChange={handleInputChange}
            handleBlur={handleBlur}
            handleClick={handleMenuClick}
        />
        <ChoiceSetting 
            title="Align" 
            prop="align" 
            choices={alignments}
            handleClick={handleAlignClick}
            current={alignments.find(al => al.value === element.align) as SettingChoice<string>}
            key={element.align}
        />
    </div>
}