import type { ReactElement } from "react";

export interface Category {
    name: string,
    description: string,
    icon: ReactElement,
    element: ReactElement
}