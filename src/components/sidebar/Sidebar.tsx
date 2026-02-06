import { useState } from "react"
import { LayersIcon, PlusIcon, SettingsIcon } from "../../assets/icons"
import { CategoryButton } from "./CategoryButton";
import type { Category } from "./category.interface";
import { BaseCategory, Components, Layers, Settings } from "./categories";

const categories : Category[] = [
    {
        name: "Components",
        description: "Drag components from sidebar and drop to the canvas.",
        icon: <PlusIcon color="white"/>,
        element: <Components/>
    },
    {
        name: "Layers",
        description: "Drag layers and drop it to change its order.",
        icon: <LayersIcon color="white"/>,
        element: <Layers/>
    },
    {
        name: "Settings",
        description: "Customize your element like you want by a lot of parameters.",
        icon: <SettingsIcon color="white"/>,
        element: <Settings/>
    }
]

export const Sidebar = () => {
    const [openedPage, setOpenedPage] = useState(categories[0]);

    const handleClick = (name: string) => () => {
        setOpenedPage(categories.find(category => category.name === name)!);
    }

    return <div className='min-w-[350px] w-3/12 bg-gray-800 pr-2 flex gap-2 flex-1 overflow-hidden'>
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