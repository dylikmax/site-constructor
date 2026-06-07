import { type ReactNode,} from "react";

interface Props {
  children: ReactNode;
  title: string;
}

export const BaseSetting = ({ title, children }: Props) => {
  return (
    <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
      <h4 className="font-bold text-lg">{title}</h4>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};
