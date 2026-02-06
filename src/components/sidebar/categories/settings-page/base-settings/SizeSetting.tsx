import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../../../redux";
import { useEffect, useState } from "react";

interface Props {
    from: number;
    to: number;
    propName: string;
    title: string;
}

export const SizeSetting = ({ from, to, propName, title } : Props ) => {
    const element = useSelector((state: RootState) => state.editor.selectedElement)

    if (!element || !(propName in element)) {
        return <></>
    }

    const value = +element[propName as keyof typeof element]!

    const [currentSize, setCurrentSize] = useState(value);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentSize(value);
    }, [element])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSize(+e.target.value);
        dispatch(editElement({ ...element, [propName]: +e.target.value }))
    }

    return <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
        <h4 className="text-lg font-bold">{title}</h4>
        <div className="flex justify-between items-center">
            {currentSize}
            <input 
                type="range"
                className="w-10/12 cursor-pointer h-2 bg-gray-700 
                    rounded appearance-none
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gray-500"
                min={from}
                max={to}
                step={1}
                value={currentSize}
                onChange={handleChange}
            />
        </div>
    </div>
}