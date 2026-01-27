import { useState } from "react"
import { LayersIcon, PlusIcon } from "../../assets/icons"
import { CategoryButton } from "./CategoryButton";
import type { Category } from "./category.interface";
import { BaseCategory, Components, Layers } from "./categories";

const categories : Category[] = [
    {
        name: "Components",
        description: "Drag components from sidebar and drop to the canvas.",
        icon: <PlusIcon color="white"/>,
        element: <Components/>
    },
        {
        name: "Layers",
        description: "All to manage your current layers.",
        icon: <LayersIcon color="white"/>,
        element: <Layers/>
    }
]

export const Sidebar = () => {
    const [openedPage, setOpenedPage] = useState(categories[0]);

    const handleClick = (name: string) => () => {
        setOpenedPage(categories.find(category => category.name === name)!);
    }

    return <div className='min-w-[350px] w-3/12 bg-gray-800 pr-2 flex gap-2'>
        <div className="w-2/12 h-full bg-gray-700">
            {categories.map((category, i) => <CategoryButton
                isActive={category.name === openedPage.name}
                icon={category.icon}
                onClick={handleClick(category.name)}
                key={i}
            />)}
        </div>
        <BaseCategory category={openedPage}/>
    </div>
}