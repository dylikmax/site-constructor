import { HexAlphaColorPicker } from "react-colorful";
import { PlusIcon } from "../../../../../assets/icons";

interface ModalProps {
    currentColor: string | undefined;
    handleChange: (color: string) => void
    handleChangeEnd: (color: string) => void
    handleClose: () => void
}

export const ModalColorChoise = ({ currentColor, handleChange, handleClose, handleChangeEnd } : ModalProps) => {
    return <div className="absolute top-[76px] z-50">
        <div className="p-2 bg-gray-800 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between items-center">
                Choose your color
                <div 
                    onClick={handleClose}
                >
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