import { useDispatch, useSelector } from "react-redux";
import { editElement, type RootState } from "../../../../../redux";
import { useEffect, useState, useCallback } from "react";
import { api } from "../../../../../api/client";

const BACKEND_URL = "http://localhost:3000";

interface Attachment {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
}

interface Props {
  propName: string;
  title: string;
}

export const ImageSetting = ({ propName, title }: Props) => {
  const element = useSelector(
    (state: RootState) => state.editor.selectedElement,
  );
  const dispatch = useDispatch();

  const [images, setImages] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentValue =
    element && propName in element
      ? ((element as Record<string, any>)[propName] as
          | string
          | null
          | undefined)
      : undefined;

  // 🔧 Делаем URL абсолютным
  const getFullUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BACKEND_URL}${path}`;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<Attachment[]>("/attachments");
        if (isMounted) {
          setImages(data.filter((a) => a.mimeType.startsWith("image/")));
        }
      } catch {
        if (isMounted) setError("Fail to load images");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchImages();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = useCallback(
    (url: string | null) => {
      if (!element) return;
      dispatch(editElement({ ...element, [propName]: url }));
    },
    [element, propName, dispatch],
  );

  if (!element || !(propName in element)) return null;

  return (
    <div className="bg-gray-800 p-2 rounded-lg flex flex-col gap-2">
      <h4 className="text-lg font-bold text-gray-200">{title}</h4>

      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={`
            h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all
            ${
              !currentValue
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-gray-600 hover:border-gray-500 text-gray-500 hover:text-gray-400"
            }
          `}
        >
          <span className="text-lg">✕</span>
          <span className="text-xs">Reset</span>
        </button>

        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`loader-${i}`}
              className="h-16 bg-gray-700 rounded-lg animate-pulse"
            />
          ))}

        {error && (
          <p className="col-span-3 text-sm text-red-400 bg-red-900/20 p-2 rounded">
            {error}
          </p>
        )}

        {!loading &&
          images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => handleSelect(img.url)}
              className={`
              relative h-16 rounded-lg overflow-hidden border-2 transition-all
              ${
                currentValue === img.url
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-transparent hover:border-gray-500"
              }
            `}
            >
              <img
                src={getFullUrl(img.url)}
                alt={img.originalName}
                className="w-full h-full object-cover"
                // 🔍 Если картинка всё ещё не грузится, смотрите ошибку в консоли
                onError={(e) => {
                  console.error("❌ Ошибка загрузки:", e.currentTarget.src);
                  // Надежная base64-заглушка (серый квадрат)
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzNzQxNTEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzlDQTNCMyIgZm9udC1zaXplPSIxMiI+4oCcPC90ZXh0Pjwvc3ZnPg==";
                }}
              />
              {currentValue === img.url && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400 drop-shadow-md"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}

        {!loading && images.length === 0 && (
          <p className="col-span-3 text-xs text-gray-500 text-center py-4">
            No uploaded images
          </p>
        )}
      </div>
    </div>
  );
};
