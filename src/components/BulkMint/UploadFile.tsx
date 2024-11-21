import { useRef } from "react";

type UploadFileProps = {
  title: string;
  accept: string;
  file: File;
  handleChange: (evnet: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({ title, accept, file, handleChange }: UploadFileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="upload__file__with__name">
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        ref={inputRef}
        hidden
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex w-full"
      >
        {title}
        <span className="ml-2">
          <img src="assets/img/Upload_ico.svg" alt="" />
        </span>
      </button>
      <span id="custom-text">
        {file ? `${file.name} file selected.` : "Choose File"}
      </span>
    </div>
  )
}