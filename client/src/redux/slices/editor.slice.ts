import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { EditorElement, Body } from "../../elements";
import { api } from "../../api/client";
import type { ProjectInterface } from "../../projects/project.interface";

interface ProjectApiResponse {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  tree: Body;
}

interface EditorState {
  bodyElement: Body;
  selectedElement: EditorElement | null;
  isLoading: boolean;
  error: string | null;
  project: ProjectInterface
}

type Result<T> = { success: true; value: T } | { success: false };

const initialState: EditorState = {
  bodyElement: {
    uuid: "1",
    name: "Body",
    type: "body",
    content: [],
    background: "#000000",
  },
  selectedElement: null,
  isLoading: false,
  error: null,
  project: {
    name: "",
    isActive: false,
    url: "",}
};

interface AddMoveElementPayload {
  element: EditorElement;
  parentUuid: string;
  index?: number;
}

export const fetchProject = createAsyncThunk<
  ProjectApiResponse,
  number,
  { rejectValue: string }
>("editor/fetchProject", async (projectId, { rejectWithValue }) => {
  try {
    const { data } = await api.get<ProjectApiResponse>(
      `/projects/${projectId}`,
    );

    if (!data?.tree) {
      throw new Error("Invalid project structure: missing tree");
    }
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to load project",
    );
  }
});

const addElementRecursive = (
  element: EditorElement,
  action: PayloadAction<AddMoveElementPayload>,
): Result<EditorElement> => {
  if (
    element.uuid === action.payload.parentUuid &&
    "content" in element &&
    Array.isArray(element.content)
  ) {
    const { element: newElement, index } = action.payload;
    const currentContent = element.content;

    let newContent: EditorElement[];

    if (index !== undefined && index >= 0 && index <= currentContent.length) {
      newContent = [
        ...currentContent.slice(0, index),
        newElement,
        ...currentContent.slice(index),
      ];
    } else {
      newContent = [...currentContent, newElement];
    }

    return {
      success: true,
      value: {
        ...element,
        content: newContent,
      },
    };
  } else if ("content" in element && Array.isArray(element.content)) {
    const contentResults = element.content.map((child) =>
      addElementRecursive(child, action),
    );

    const addedIndex = contentResults.findIndex((r) => r.success);

    if (addedIndex !== -1) {
      const newContent = element.content.map((child, i) =>
        contentResults[i].success ? contentResults[i].value : child,
      );

      return {
        success: true,
        value: {
          ...element,
          content: newContent,
        },
      };
    }
  }
  return { success: false };
};

const editElementRecursive = (
  element: EditorElement,
  action: PayloadAction<EditorElement>,
): EditorElement => {
  if (element.uuid === action.payload.uuid) {
    return { ...action.payload };
  } else if ("content" in element && Array.isArray(element.content)) {
    return {
      ...element,
      content: element.content.map((child) =>
        editElementRecursive(child, action),
      ),
    };
  }
  return element;
};

const deleteElementRecursive = (
  element: EditorElement,
  action: PayloadAction<EditorElement>,
): EditorElement => {
  if ("content" in element && Array.isArray(element.content)) {
    const filteredContent = element.content
      .filter((child) => child.uuid !== action.payload.uuid)
      .map((child) => deleteElementRecursive(child, action));

    return {
      ...element,
      content: filteredContent,
    };
  }
  return element;
};

const selectElementRecursive = (
  element: EditorElement,
  action: PayloadAction<EditorElement | null>,
): EditorElement | null => {
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
  }
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<AddMoveElementPayload>) => {
      const result = addElementRecursive(state.bodyElement, action);
      if (!result.success) {
        return;
      }

      state.bodyElement = result.value as Body;
    },
    editElement: (state, action: PayloadAction<EditorElement>) => {
      state.bodyElement = editElementRecursive(
        state.bodyElement,
        action,
      ) as Body;
    },
    deleteElement: (state, action: PayloadAction<EditorElement>) => {
      state.bodyElement = deleteElementRecursive(
        state.bodyElement,
        action,
      ) as Body;
      state.selectedElement = null;
    },
    moveElement: (state, action: PayloadAction<AddMoveElementPayload>) => {
      const newBody = deleteElementRecursive(state.bodyElement, {
        payload: action.payload.element,
        type: "editor/deleteElement",
      }) as Body;

      const addResult = addElementRecursive(newBody, {
        payload: action.payload,
        type: "editor/addElement",
      });

      if (!addResult.success) {
        return;
      }

      state.bodyElement = addResult.value as Body;
    },
    selectElement: (state, action: PayloadAction<EditorElement | null>) => {
      state.selectedElement = selectElementRecursive(state.bodyElement, action);
    },
    updateProjectMeta: (
      state,
      action: PayloadAction<{ name?: string; url?: string }>,
    ) => {
      if (action.payload.name !== undefined) state.project.name = action.payload.name;
      if (action.payload.url !== undefined) state.project.url = action.payload.url;
    },
    changeAccess: (state) => {
      state.project.isActive = !state.project.isActive;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.project.name = action.payload.name;
        state.project.url = action.payload.url;
        state.project.isActive = action.payload.isActive;
        state.bodyElement = action.payload.tree;
        state.selectedElement = null;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const {
  addElement,
  editElement,
  deleteElement,
  moveElement,
  selectElement,
  updateProjectMeta,
  changeAccess,
} = editorSlice.actions;
export default editorSlice.reducer;
