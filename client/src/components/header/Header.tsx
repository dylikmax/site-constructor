import { NavLink, useParams } from "react-router-dom";
import { ArrowIcon } from "../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../redux";
import { useCallback, useEffect, useState } from "react";
import {
  changeAccess,
  updateProjectMeta,
} from "../../redux/slices/editor.slice";
import { api } from "../../api/client";

export const Header = () => {
  const { isActive, name, url, bodyElement } = useSelector(
    (state: RootState) => state.editor,
  );
  const dispatch = useDispatch();
  const [nameInput, setNameInput] = useState(name);
  const [urlInput, setUrlInput] = useState(url);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams();

  useEffect(() => setNameInput(name), [name]);
  useEffect(() => setUrlInput(url), [url]);

  const handleChange =
    (setFn: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFn(e.target.value);
    };

  const handleBlur = useCallback(async () => {
    if (isSaving) return;

    const updates: { name?: string; url?: string } = {};
    if (nameInput.trim() !== name) updates.name = nameInput.trim();
    if (urlInput.trim() !== url)
      updates.url = urlInput.trim().replace(/^\/+/, "");

    if (Object.keys(updates).length === 0) return;

    setIsSaving(true);
    try {
      const { data } = await api.patch(`/projects/${id}`, updates);

      dispatch(updateProjectMeta({ name: data.name, url: data.url }));
    } catch (error) {
      console.error("Failed to save project:", error);
      setNameInput(name);
      setUrlInput(url);
    } finally {
      setIsSaving(false);
    }
  }, [nameInput, urlInput, name, url, id, isSaving, dispatch]);

  const handleSave = () => {
    const updates = {
      tree: bodyElement,
    };
    api.patch(`/projects/${id}`, updates);
  };

  const handleCheck = () => {
    dispatch(changeAccess());
    const updates = {
      isActive: !isActive,
    };

    api.patch(`/projects/${id}`, updates);
  };

  return (
    <div className="bg-gray-900 py-3 relative flex z-10 justify-between px-6">
      <NavLink
        to="/projects"
        className="flex items-center gap-1 bg-gray-700 rounded-lg p-1 w-36 hover:duration-100 hover:bg-gray-800"
      >
        <ArrowIcon color="white" size={15} className="rotate-90" />
        Back to projects
      </NavLink>
      <div className="flex gap-8">
        <div className="flex gap-1 items-center">
          Name:
          <input
            type="text"
            value={nameInput}
            className="bg-gray-800 rounded-lg px-2 w-32"
            onChange={handleChange(setNameInput)}
            onBlur={handleBlur}
          />
        </div>
        <div className="flex gap-1 items-center">
          URL:
          <div className="bg-gray-800 rounded-lg px-2 flex items-center w-full">
            /
            <input
              type="text"
              value={urlInput}
              className="bg-gray-800 rounded-lg px-1 h-full w-28"
              onChange={handleChange(setUrlInput)}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 bg-gray-700 rounded-lg px-2 hover:duration-100 hover:bg-gray-800"
        >
          Save changes
        </button>
        <div className="flex gap-2 items-center">
          <span className="text-sm select-none">Public</span>
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isActive}
              onChange={handleCheck}
            />
            <div
              className="w-5 h-5 border-2 border-gray-500 rounded bg-gray-800 
                          peer-checked:bg-gray-400 peer-checked:border-gray-400
                          flex items-center justify-center transition-all duration-200"
            >
              <svg
                className="w-3.5 h-3.5 text-white hidden peer-checked:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
