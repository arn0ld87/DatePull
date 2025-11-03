import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}
// Custom Icon
const IconUploadCloud: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-4-4a4 4 0 014-4h.293a1 1 0 01.97-.732A5.996 5.996 0 0118.293 8h.414a4 4 0 014 4a4 4 0 01-4 4H7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-4-4m4 4l4-4m-4 4V7" />
    </svg>
);


const FileUpload: React.FC<FileUploadProps> = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(null);
    setPreview(null);

    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/');
      const isPdf = selectedFile.type === 'application/pdf';

      if (isImage || isPdf) {
        setFile(selectedFile);
        if (isImage) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
        }
      } else {
        console.warn("Unsupported file type:", selectedFile.type);
      }
    }
  };


  const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`mt-1 flex justify-center px-6 pt-8 pb-8 border-2 ${isDragging ? 'border-brand-primary' : 'border-brand-surface-light'} border-dashed rounded-xl transition-colors duration-200 bg-brand-surface/50`}
      >
        <div className="space-y-2 text-center">
          <IconUploadCloud className="mx-auto h-12 w-12 text-brand-text-secondary" />
          <div className="flex text-sm text-brand-text-secondary">
            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-dark focus-within:ring-brand-primary px-1">
              <span>Datei hochladen</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
            </label>
            <p className="pl-1">oder per Drag & Drop ziehen</p>
          </div>
          <p className="text-xs text-brand-text-secondary/70">PDF, PNG, JPG bis zu 10MB</p>
        </div>
      </div>
      {file && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2 text-brand-text-secondary">Ausgewählte Datei:</h4>
          {preview ? (
            <img src={preview} alt="Vorschau des Stundenplans" className="max-w-full h-auto rounded-lg shadow-md border border-brand-surface-light" />
          ) : (
            <div className="p-3 bg-brand-surface rounded-lg flex items-center space-x-3 shadow-inner border border-brand-surface-light">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                 </svg>
                 <span className="font-mono text-sm text-brand-text-primary truncate">{file.name}</span>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;