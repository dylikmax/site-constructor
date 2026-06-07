import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../../../redux";
import { useEffect, useState } from "react";
import { BaseSetting } from "./BaseSetting";

interface Props {
    from: number;
    to: number;
    propName: string;
    title: string;
}

export const SizeSetting = ({ propName, title } : Props ) => {
    const element = useSelector((state: RootState) => state.editor.selectedElement)

    if (!element || !(propName in element)) {
        return <></>
    }

    const value = +element[propName as keyof typeof element]!

    const [currentSize, setCurrentSize] = useState(String(value));
    const [initialSize, setInitialSize] = useState(value)
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrentSize(String(value));
        setInitialSize(value);
    }, [element])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSize(e.target.value);
    }

    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = +e.target.value;
        if (Number.isNaN(value)) {
            setCurrentSize(String(initialSize));
            return;
        }

        setCurrentSize(String(value));
        setInitialSize(value);
        dispatch(editElement({ ...element, [propName]: +e.target.value }))
    }

    return <BaseSetting title={title}>
        <input
            type="text"
            value={currentSize}
            className="bg-gray-800 px-2 w-16"
            onChange={handleChange}
            onBlur={handleBlur}
          />
    </BaseSetting>
}