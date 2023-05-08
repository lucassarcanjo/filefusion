import { useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FileImage } from "lucide-react";

import fileMoving from "./assets/file-moving.json";
import { Separator } from "./components/Separator";
import { Button } from "./components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/Select";

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const playerRef = useRef<Player>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      // handleFiles(e.dataTransfer.files);
      console.log("drag");

      setFiles(Array.from(event.dataTransfer.files));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // handleFiles(e.target.files);
      console.log("change");

      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <main className="h-screen bg-gradient-to-b from-[#EEF4FA] to-[#CFE2F7] flex items-center justify-center">
      <section
        className="bg-white p-7 rounded-3xl shadow-xl w-[600px] relative"
        onMouseEnter={() => playerRef.current?.play()}
      >
        <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-[20px] bg-[#F2F6FC] w-full h-full border-2 border-dashed border-[#BBC9D7] flex items-center justify-center flex-col py-6 px-4">
            <div className="w-[250px] h-[250px]">
              <Player ref={playerRef} src={fileMoving} />
            </div>
            <p className="text-lg  text-center text-muted-foreground">
              Arraste aqui as imagens que você deseja converter. Elas serão
              enviadas automaticamente.
            </p>

            <Separator className="my-4 max-w-xs" />

            <label htmlFor="picture-input">
              <Button
                className="bg-[#3A55F3] font-bold"
                onClick={() => fileInputRef.current?.click()}
              >
                Procurar arquivos
              </Button>
              <input
                multiple
                id="picture-input"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/tiff"
              />

              {dragActive && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-[#3A55F3] bg-opacity-10 rounded-[20px]"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                />
              )}
            </label>
          </div>
        </form>
        {files.length > 0 && (
          <div className="mt-4 ">
            <ul className="mt-2 flex flex-col gap-4">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="text-sm bg-[#F9F9F9] rounded-xl p-4 flex gap-4 items-center"
                >
                  <FileImage size={20} className="text-[#BBC9D7]" />
                  <span className="mr-auto">{file.name}</span>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="gif">GIF</SelectItem>
                      <SelectItem value="bmp">BMP</SelectItem>
                      <SelectItem value="tiff">TIFF</SelectItem>
                    </SelectContent>
                  </Select>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#3A55F3]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </li>
              ))}
            </ul>
            {/* <p className="mt-6 text-sm text-muted-foreground text-right">
              {files.length} arquivos selecionados
            </p> */}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
