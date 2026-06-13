import { useDispatch, useSelector } from "react-redux";
import { ColorSetting } from "../base-settings";
import { ChoiceSetting } from "../base-settings/ChoiceSetting";
import { editElement, type RootState } from "../../../../../redux";
import type { Container } from "../../../../../elements";
import type { SettingChoice } from "../../../../../types";

const columns: SettingChoice<number>[] = [{
  id: 1,
  value: 1,
  visual: "1"
}, {
  id: 2,
  value: 2,
  visual: "2"
}, {
  id: 3,
  value: 3,
  visual: "3"
}, {
  id: 4,
  value: 4,
  visual: "4"
}]
export const ContainerSettings = () => {
  const element = useSelector((state: RootState) => state.editor.selectedElement || state.editor.bodyElement) as Container;
  console.log(element);
  
  const dispatch = useDispatch();

  const handleColumnsClick = (choice: SettingChoice<number>) => () => {
      dispatch(editElement({ uuid: element.uuid, columns: choice.value } as Partial<Container>));
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      <ColorSetting 
        prop="backgroundColor" 
        title="Background color"
        handleChange={(newColor: string) => dispatch(editElement({ uuid: element.uuid, background: newColor } as Partial<Container>))}
        color={element.background}
      />
      <ChoiceSetting<number>  
        prop="columns"
        title="Columns count"
        choices={columns}
        handleClick={handleColumnsClick}
        current={columns.find(c => c.value === element.columns) as SettingChoice<number>}
      />
      {/* <ImageSetting title="Background image" propName="backgroundImage" /> */}
    </div>
  );
};
