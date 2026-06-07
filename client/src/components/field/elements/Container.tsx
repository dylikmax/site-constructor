import type { Container } from "../../../elements";
import { FieldElement } from "./FieldElement";

interface Props {
  element: Container;
}

export const ContainerElement = ({ element }: Props) => {
  return (
    <div
      className="p-3 grid gap-2 h-full w-full"
      style={{
        backgroundColor: element.background,
        minHeight: 50,
        gridTemplateColumns: `repeat(${element.columns}, 1fr)`,
        backgroundImage: element.backgroundImage
          ? `url(http://localhost:3000${element.backgroundImage})`
          : undefined,
      }}
    >
      {element.content.map((el, i) => (
        <FieldElement
          element={el}
          key={el.uuid}
          parentUuid={element.uuid}
          index={i}
        />
      ))}
    </div>
  );
};
