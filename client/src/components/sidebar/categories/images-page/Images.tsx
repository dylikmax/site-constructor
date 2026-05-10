import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { api } from '../../../../api/client';

type FileUploaderProps = {
  projectId?: number;
  onUploadComplete?: () => void;
  maxFileSizeMB?: number;
};

export const Images = ({ 
  projectId, 
  onUploadComplete, 
  maxFileSizeMB = 50 
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: File[]) => {
    const valid = newFiles.filter(f => {
      if (f.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File "${f.name}" exceeds ${maxFileSizeMB} MB`);
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...valid]);
  };

  const onDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  };

  const onSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const uploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        
        const url = projectId 
          ? `/attachments?projectId=${projectId}` 
          : '/attachments';

        await api.post(url, formData);
      }
      setFiles([]);
      setProgress(100);
      onUploadComplete?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-gray-800 rounded-xl border border-gray-700">
      {/* 🔽 Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
        `}
      >
        <input ref={inputRef} type="file" multiple className="hidden" onChange={onSelect} />
        <p className="text-gray-300">Drag files here or <span className="text-blue-400 underline">choose</span></p>
        <p className="text-xs text-gray-500 mt-1">Max. {maxFileSizeMB} MB for the file</p>
      </div>

      {/* 📂 Список файлов */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded text-sm">
              <span className="truncate flex-1 mr-2 text-gray-200">
                {f.name} <span className="text-gray-500 text-xs">({(f.size / 1024).toFixed(1)} КБ)</span>
              </span>
              {!uploading && (
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                  className="text-gray-400 hover:text-red-400 px-1"
                >✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 📊 Прогресс */}
      {uploading && (
        <div className="mt-3">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Loading: {progress}%</p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-400 bg-red-900/30 px-2 py-1 rounded">{error}</p>}

      {/* 🚀 Кнопка */}
      <button
        onClick={uploadAll}
        disabled={uploading || files.length === 0}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-colors"
      >
        {uploading ? 'Loading...' : `Load ${files.length} file(s)`}
      </button>
    </div>
  );
};