import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { EditorElement, Body, Container, Text } from "../../elements";

interface EditorState {
    bodyElement: Body;
    selectedElement: EditorElement | null;
}

type Result<T> = 
    | { success: true, value: T }
    | { success: false }

const initialState : EditorState = {
    bodyElement: {
        uuid: "1",
        name: "Body",
        type: "body",
        content: [{
                uuid: "2",
                name: "2",
                type: "container",
                columns: 1,
                content: [{
                        uuid: "4",
                        name: "4",
                        type: "text",
                        content: "text 1",
                        size: 16,
                        align: "center",
                        color: "#242424"
                    } as Text,
                    {
                        uuid: "5",
                        name: "5",
                        type: "container",
                        columns: 3,
                        content: [{
                                uuid: "228",
                                name: "228",
                                type: "text",
                                content: "text 2",
                                size: 24,
                                align: "left",
                                color: "#FFFFFF"
                            } as Text,
                            {
                                uuid: "229",
                                name: "229",
                                type: "text",
                                content: "text 3",
                                size: 12,
                                align: "center",
                                color: "#FFFFFF"
                            } as Text
                        ],
                        background: "#0C0C0C"
                    } as Container
                ],
                background: "#F6F6F6"
            } as Container, {
                uuid: "3",
                name: "3",
                type: "text",
                content: "text 4",
                size: 16,
                align: "right",
                color: "#FFFFFF"
            } as Text
        ],
        background: "#000000"
    },
    selectedElement: null
}

interface AddMoveElementPayload {
    element: EditorElement;
    parentUuid: string;
    index?: number;
}

const addElementRecursive = (
    element: EditorElement, 
    action: PayloadAction<AddMoveElementPayload>
): Result<EditorElement> => {
    if (element.uuid === action.payload.parentUuid && "content" in element && Array.isArray(element.content)) {
        const { element: newElement, index } = action.payload;
        const currentContent = element.content;
        
        let newContent: EditorElement[];
        
        if (index !== undefined && index >= 0 && index <= currentContent.length) {
            newContent = [
                ...currentContent.slice(0, index),
                newElement,
                ...currentContent.slice(index)
            ];
        } else {
            newContent = [...currentContent, newElement];
        }

        return { 
            success: true,
            value: {
                ...element,
                content: newContent
            }
        };
    } else if ("content" in element && Array.isArray(element.content)) {
        const contentResults = element.content.map(child => addElementRecursive(child, action));

        const addedIndex = contentResults.findIndex(r => r.success);

        if (addedIndex !== -1) {
            const newContent = element.content.map((child, i) => 
              contentResults[i].success 
                ? contentResults[i].value
                : child
            );

            return {
              success: true,
              value: {
                ...element,
                content: newContent
              }
            };
        }
    }
    return { success: false };
}

const editElementRecursive = (element: EditorElement, action: PayloadAction<EditorElement>): EditorElement => {
    if (element.uuid === action.payload.uuid) {
        return { ...action.payload };
    } else if ("content" in element && Array.isArray(element.content)) {
        return {
            ...element,
            content: element.content.map(child => editElementRecursive(child, action))
        };
    }
    return element;
}

const deleteElementRecursive = (element: EditorElement, action: PayloadAction<EditorElement>): EditorElement => {
    if ("content" in element && Array.isArray(element.content)) {
        const filteredContent = element.content
            .filter(child => child.uuid !== action.payload.uuid)
            .map(child => deleteElementRecursive(child, action));
        
        return {
            ...element,
            content: filteredContent
        };
    }
    return element;
}

const selectElementRecursive = (element: EditorElement, action: PayloadAction<EditorElement | null>): EditorElement | null => {
    {
        if (element.uuid === action.payload?.uuid) {
            return element;
        }
        
        if ("content" in element && Array.isArray(element.content)) {
            for (const child of element.content) {
                const found = selectElementRecursive(child, action);
                if (found !== null) {
                    return found;
                }
            }
        }
        
        return null;
    };
    }

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        addElement: (state, action: PayloadAction<AddMoveElementPayload>) => {
            const result = addElementRecursive(state.bodyElement, action);
            if (!result.success) {
                return;
            }

            state.bodyElement = result.value as Body
        },
        editElement: (state, action: PayloadAction<EditorElement>) => {
            state.bodyElement = editElementRecursive(state.bodyElement, action) as Body;
        },
        deleteElement: (state, action: PayloadAction<EditorElement>) => {
            state.bodyElement = deleteElementRecursive(state.bodyElement, action) as Body;
            state.selectedElement = null;
        },
        moveElement: (state, action: PayloadAction<AddMoveElementPayload>) => {
            const newBody = deleteElementRecursive(
                state.bodyElement, 
                { 
                    payload: action.payload.element,
                    type: 'editor/deleteElement' 
                }
            ) as Body;
            
            const addResult = addElementRecursive(
                newBody, 
                { 
                    payload: action.payload,
                    type: 'editor/addElement' 
                }
            );

            if (!addResult.success) {
                return;
            }

            state.bodyElement = addResult.value as Body;
        },
        selectElement: (state, action: PayloadAction<EditorElement | null>) => {
            state.selectedElement = selectElementRecursive(state.bodyElement, action);
        }
    }
});

export const { 
    addElement, 
    editElement, 
    deleteElement, 
    moveElement, 
    selectElement
} = editorSlice.actions;
export default editorSlice.reducer;