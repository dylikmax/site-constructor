import clsx from "clsx"
import type { MouseEventHandler, ReactElement } from "react"

interface Props {
    isActive: boolean,
    icon: ReactElement,
    onClick: MouseEventHandler
}

export const CategoryButton = ({ isActive, icon, onClick } : Props) => {
    return <div className={clsx("p-3",
        {
            "bg-gray-600": isActive,
            "cursor-pointer hover:bg-gray-500 hover:duration-100": !isActive
        }
    )}
    onClick={onClick}>
        {icon}
    </div>
}