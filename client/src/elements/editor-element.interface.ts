export interface EditorElement {
    uuid: string;
    name: string;
    type: string;
    content?: EditorElement[] | string;
}