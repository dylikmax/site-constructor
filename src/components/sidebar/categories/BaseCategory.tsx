import type { Category } from "../category.interface"

interface Props {
    category: Category
}

export const BaseCategory = ({ category }: Props) => {
    return <div className="w-full flex flex-col gap-10 pb-2 overflow-y-auto h-full">
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">{category.name}</h3>
            <p>{category.description}</p>
        </div>
        {category.element}
    </div>
}