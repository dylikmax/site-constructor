import type { SettingChoice } from "../../../../../types";
import { BaseSetting } from "./BaseSetting";

interface Props<T> {
  prop: string;
  title: string;
  choices: SettingChoice<T>[];
  handleClick: (choice: SettingChoice<T>) => () => void;
  current: SettingChoice<T>;
}

export const ChoiceSetting = <T, >({ title, choices, current, handleClick }: Props<T>) => {
  return (
    <BaseSetting title={title}>
      {choices.map(choice =>
          choice.id === current.id ? (
            <div className="bg-gray-900 p-1 rounded-lg" key={choice.id}>{choice.visual}</div>
          ) : (
            <div className="bg-gray-700 p-1 rounded-lg cursor-pointer"
            onClick={handleClick(choice)}
            key={choice.id}
            >{choice.visual}</div>
          ),
        )}
    </BaseSetting>
  );
};
