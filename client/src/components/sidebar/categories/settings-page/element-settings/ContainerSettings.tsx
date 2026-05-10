import { ColorSetting } from "../base-settings";
import { ChoiceSetting } from "../base-settings/ChoiceSetting";
import { ImageSetting } from "../base-settings/ImageSetting";

export const ContainerSettings = () => {
  return (
    <div className="p-2 flex flex-col gap-4">
      <ColorSetting propName="background" title="Background color" />
      <ChoiceSetting
        propName="columns"
        title="Columns count"
        values={["1", "2", "3", "4"]}
      />
      <ImageSetting title="Background image" propName="backgroundImage" />
    </div>
  );
};
