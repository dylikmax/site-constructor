import clsx from "clsx";

interface DropdownProps<T> {
    values: T[];
    current: T;
    handleClick: (arg: T) => () => void
}

export const DropdownList = <T,>({ values, current, handleClick } : DropdownProps<T>) => {
    return <div className="absolute left-[75px] top-[40px] bg-gray-700 rounded-lg w-16 flex flex-col">
        {values.map((value, i) => <div className={clsx("pl-3 py-1 rounded-lg cursor-pointer hover:bg-gray-600", {
            "bg-gray-800": current === value
        })}
        onClick={handleClick(value)}
        key={i}
        >
            {String(value)}
        </div>)}
    </div>
}