import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../../../redux";
import { useEffect, useState } from "react";

interface Props {
  propName: string;
  title: string;
  values: string[];
}

export const ChoiceSetting = ({ propName, title, values }: Props) => {
  const element = useSelector(
    (state: RootState) => state.editor.selectedElement,
  );

  if (!element || !(propName in element)) {
    return <></>;
  }

  const value = element[propName as keyof typeof element]!;

  const [currentChoice, setCurrentChoice] = useState(value);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentChoice(value);
  }, [element]);

  const handleClick = (value: string) => (_: React.MouseEvent<HTMLInputElement>) => {
    setCurrentChoice(value);
    dispatch(editElement({ ...element, [propName]: value }));
  };

  return (
    <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
      <h4 className="text-lg font-bold">{title}</h4>
      <div className="flex justify-between items-center">
        {values.map((value, i) =>
          value === currentChoice ? (
            <div className="bg-gray-900 py-1 px-3 rounded-lg" key={i}>{value}</div>
          ) : (
            <div className="bg-gray-700 py-1 px-3 rounded-lg cursor-pointer"
            onClick={handleClick(value)}
            key={i}
            >{value}</div>
          ),
        )}
      </div>
    </div>
  );
};
