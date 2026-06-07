import { useDispatch, useSelector } from "react-redux"
import { editElement, type RootState } from "../../../../../redux"
import { useEffect, useState } from "react"
import { BaseSetting } from "./BaseSetting";
import { HexAlphaColorPicker } from "react-colorful";
import { PlusIcon } from "../../../../../assets/icons";

interface Props {
    propName: string;
    title: string
}

interface ModalProps {
    currentColor: string;
    handleChange: (color: string) => void
    handleChangeEnd: (color: string) => void
    handleClose: () => void
}

const ModalColorChoise = ({ currentColor, handleChange, handleChangeEnd, handleClose } : ModalProps) => {
    return <div className="absolute top-[76px]">
        <div className="p-2 bg-gray-800 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
                Choose your color
                <div onClick={handleClose}>
                    <PlusIcon 
                        color="white" 
                        size={20} 
                        className="transform rotate-45 cursor-pointer"
                    />
                </div>
            </div>
            <HexAlphaColorPicker   
                color={currentColor}
                onChange={handleChange}
                onChangeEnd={handleChangeEnd}
            />
        </div>
    </div>
}

export const ColorSetting = ({ propName, title } : Props) => {
    const element = useSelector((state: RootState) => state.editor.selectedElement || state.editor.bodyElement)

    if (!(propName in element)) {
        return <></>
    }

    const value = element[propName as keyof typeof element] as string

    const [isOpened, setIsOpened] = useState(false)
    const [currentColor, setCurrentColor] = useState(value);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentColor(value);
    }, [element])

    const handleChangeEnd = (newColor: string) => {
        setCurrentColor(newColor);
        dispatch(editElement({ ...element, [propName]: newColor }))
    }

    return <div className="relative">
        <BaseSetting title={title}>
            <div className="flex items-center gap-2">
                <div 
                    onClick={() => setIsOpened(!isOpened)}
                    className="w-6 h-6 rounded cursor-pointer"
                    style={{
                        backgroundColor: currentColor
                    }}
                ></div>
            </div>
            {currentColor.toUpperCase()}
        </BaseSetting>
                {isOpened ? <ModalColorChoise
                    currentColor={currentColor}
                    handleChange={handleChangeEnd}
                    handleChangeEnd={handleChangeEnd}
                    handleClose={() => setIsOpened(false)}
                /> : <></>}
        </div>
}
