import { useDispatch, useSelector } from "react-redux"
import { ColorSetting, SizeSetting } from "../base-settings"
import { ChoiceSetting } from "../base-settings/ChoiceSetting"
import { editElement, type RootState } from "../../../../../redux"
import type { Text } from "../../../../../elements"
import { useEffect, useState } from "react"
import { closeModal } from "../../../../../redux/slices/editor.slice"

const avaliableSizes = [10, 11, 12, 13, 14, 15, 16, 20, 24, 32, 36, 40, 48, 64, 72]

export const TextSettings = () => {
    const element = useSelector((state: RootState) => state.editor.selectedElement || state.editor.bodyElement) as Text
    const dispatch = useDispatch();

    // const [currentColor, setCurrentColor] = useState(element.color);
    // const [size, setSize] = useState(element.size);
    const [inputSize, setInputSize] = useState(String(element.size));

    // const handleColorChange = (newColor: string) => {
    //     setCurrentColor(newColor);
    //     dispatch(editElement({ ...element, color: newColor } as Text))
    // }
        
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
        dispatch(editElement({ ...element, size: value } as Text))
    }
    
    const handleMenuClick = (value: number) => () => {
        setInputSize(String(value));
        dispatch(editElement({ ...element, size: value } as Text));
        dispatch(closeModal());
    }

    useEffect(() => {
        setInputSize(String(element.size));
    }, [element.size]);

    return <div className="p-2 flex flex-col gap-4">
        <ColorSetting 
            title="Color"
            color={element.color}
            handleChange={(newColor: string) => dispatch(editElement({ ...element, color: newColor } as Text))}
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
        <ChoiceSetting title="Align" propName="align" values={['left', 'center', 'right']}/>
    </div>
}