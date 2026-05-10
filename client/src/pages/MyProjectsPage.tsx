import { useEffect, useState } from "react";
import { api } from "../api/client";
import { NavLink, useNavigate } from "react-router-dom";

export const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [nameInput, setNameInput] = useState("My project");
  const [urlInput, setUrlInput] = useState("my-project");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/projects/`);
      setProjects(data);
    })();
  }, []);

  const handleDelete = (id: number) => () => {
    setProjects(projects.filter(obj => obj.id !== id));
    api.delete(`/projects/${id}`);
  };

  const handleClick = () => {
    setIsAdding(!isAdding);
  };

  const handleAdd = () => {
    (async () => {
      const meta = {
        name: nameInput,
        url: urlInput
      }
      const { data } = await api.post(`/projects/`, meta);
      navigate(`/${data.id}`);
    })();
  };

  const handleChange =
    (setFn: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFn(e.target.value);
    };

  return (
    <div className="min-h-screen bg-gray-700 text-white p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My projects:</h1>
        <div className="flex gap-4">
          {isAdding ? (
            <div className="flex gap-4">
              <div className="flex gap-1 items-center">
                Name:
                <input
                  type="text"
                  value={nameInput}
                  className="bg-gray-800 rounded-lg px-2 w-32"
                  onChange={handleChange(setNameInput)}
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
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div
            onClick={handleClick}
            className="text-lg bg-gray-800 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
          >
            {isAdding ? "Cancel" : "Add project"}
          </div>
          {isAdding ? (
            <div
              onClick={handleAdd}
              className="text-lg bg-gray-800 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
            >
              Confirm
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {projects.map((project, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg text-xl flex justify-between py-2 px-4"
          >
            <div className="font-bold">{project.name}</div>/{project.url}
            <div className="flex gap-4">
              <NavLink to={`/${project.id}`} className="hover:text-gray-400">
                Edit
              </NavLink>
              <div
                className="text-red-500 hover:text-red-800 cursor-pointer"
                onClick={handleDelete(project.id)}
              >
                Delete
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
