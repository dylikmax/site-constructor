import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../../../redux";
import { BaseSetting } from "./BaseSetting";
import { ArrowIcon } from "../../../../../assets/icons";
import clsx from "clsx";
import { DropdownList } from "../modals";
import { closeModal, openModal } from "../../../../../redux/slices/editor.slice";
import type { ModalName } from "../../../../../types";

interface Props {
    dropdownValues: number[]
    prop: ModalName;
    title: string;
    size: number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClick: (size: number) => () => void;
}

export const SizeSetting = ({ prop, title, dropdownValues, size, handleChange, handleBlur, handleClick } : Props ) => {
    const isOpened = useSelector((state: RootState) => state.editor.activeModal) === prop
    const dispatch = useDispatch();

    return <div className="relative">
        <BaseSetting title={title}>
            <input
                type="text"
                value={size}
                className="bg-gray-800 px-2 w-10"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div 
                className={clsx("cursor-pointer", {
                  "transform -rotate-90": isOpened 
                })}
                onClick={() => isOpened ? dispatch(closeModal()) : dispatch(openModal(prop))}
              >
                <ArrowIcon color="white" size={15}/>
              </div>
        </BaseSetting>
        {isOpened ? <DropdownList<number> 
            values={dropdownValues}
            current={size}
            handleClick={handleClick}
        /> : <></>}
    </div>
}