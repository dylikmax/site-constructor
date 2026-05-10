import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../../../redux";
import { useEffect, useState, type ReactNode } from "react";
import type { Hex } from "../../../../../types";

interface Props {
  propName: string;
  title: string;
}

export const BaseSetting = <T,>({ propName, title }: Props) => {
  const element = useSelector(
    (state: RootState) =>
      state.editor.selectedElement || state.editor.bodyElement,
  );

  const value = element[propName as keyof typeof element] as T;

  const [currentValue, setCurrentValue] = useState(value);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentValue(value);
  }, [element]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value as T);
    dispatch(editElement({ ...element, [propName]: e.target.value }));
  };

  if (!(propName in element)) {
    return <></>;
  }

  return (
    <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
      <h4 className="font-bold text-lg">{title}</h4>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="
                    w-10 h-10
                    [&::-webkit-color-swatch]:border-none
                    [&::-webkit-color-swatch-wrapper]:p-0
                    rounded-lg
                    cursor-pointer
                "
          value={currentValue}
          onChange={handleChange}
        />
        {currentValue.toUpperCase()}
      </div>
    </div>
  );
};
