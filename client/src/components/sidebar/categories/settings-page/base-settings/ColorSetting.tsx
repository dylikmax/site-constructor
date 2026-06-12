import { BaseSetting } from "./BaseSetting";
import { ModalColorChoise } from "../modals";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../redux";
import { closeModal, openModal } from "../../../../../redux/slices/editor.slice";
import type { ModalName } from "../../../../../types";

interface Props {
    title: string;
    color: string;
    handleChange: (newColor: string) => void;
    prop: ModalName
}

export const ColorSetting = ({ title, color, handleChange, prop } : Props) => {
    const isOpened = useSelector((state: RootState) => state.editor.activeModal) === prop
    const dispatch = useDispatch();
    return <div className="relative">
        <BaseSetting title={title}>
            <div className="flex items-center gap-2">
                <div 
                    className="w-6 h-6 rounded cursor-pointer"
                    style={{
                        backgroundColor: color
                    }}
                    onClick={() => isOpened ? dispatch(closeModal()) : dispatch(openModal(prop))}
                ></div>
            </div>
            {color}
        </BaseSetting>
                {isOpened ? <ModalColorChoise
                    currentColor={color}
                    handleChange={handleChange}
                    handleChangeEnd={handleChange}
                    handleClose={() => dispatch(closeModal())}
                /> : <></>}
        </div>
}
