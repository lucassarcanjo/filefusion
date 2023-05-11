import { useEffect, useReducer, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FileImage } from "lucide-react";

import { Separator } from "./components/Separator";
import { Button } from "./components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/Select";

import fileMoving from "./assets/file-moving.json";
import loading from "./assets/loading.json";
import alert from "./assets/alertOctagon.json";
import download from "./assets/download.json";

type ImageFormat = "png" | "jpeg" | "gif" | "bmp" | "tiff";

interface ConversionOperation {
  file: File;
  format: ImageFormat | undefined;
  result: string | null;
  loading: boolean;
  error: boolean | null;
}

const initalState: ConversionOperation[] = [];

const reducer = (
  state: ConversionOperation[],
  action: any
): ConversionOperation[] => {
  switch (action.type) {
    case "SET_FILES":
      return [
        ...state,
        ...action.payload.map((file: File) => ({
          file,
          format: "",
          result: null,
          loading: false,
          error: null,
        })),
      ];

    case "SET_FORMAT":
      return state.map((file, index) =>
        index === action.payload.index
          ? { ...file, format: action.payload.format }
          : file
      );

    case "SET_RESULT":
      return state.map((file, index) =>
        index === action.payload.index
          ? { ...file, result: action.payload.result }
          : file
      );

    case "SET_LOADING":
      return state.map((file, index) =>
        index === action.payload.index
          ? { ...file, loading: action.payload.loading }
          : file
      );

    case "SET_ERROR":
      return state.map((file, index) =>
        index === action.payload.index
          ? { ...file, error: action.payload.error }
          : file
      );

    default:
      return state;
  }
};

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [conversionFiles, dispatch] = useReducer(reducer, initalState);

  const playerRef = useRef<Player>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    dispatch({ type: "SET_FILES", payload: Array.from(files) });
  };

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
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFiles(event.target.files);
    }
  };

  useEffect(() => {
    if (conversionFiles.length === 0) {
      playerRef.current?.play();
      return;
    }

    conversionFiles.forEach((file, index) => {
      if (!file.format) return;
      if (file.result !== null) return;
      if (file.loading) return;
      if (file.error !== null) return;

      dispatch({ type: "SET_LOADING", payload: { index, loading: true } });

      const formData = new FormData();
      formData.append("image", file.file);
      formData.append("format", file.format);

      fetch("http://localhost:3001/convert", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          dispatch({
            type: "SET_RESULT",
            payload: { index, result: url },
          });
        })
        .catch((error) => {
          console.error(error);
          dispatch({
            type: "SET_ERROR",
            payload: { index, error: true },
          });
        })
        .finally(() => {
          dispatch({ type: "SET_LOADING", payload: { index, loading: false } });
        });
    });
  }, [conversionFiles]);

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
        {conversionFiles.length > 0 && (
          <div className="mt-4 ">
            <ul className="mt-2 flex flex-col gap-4">
              {conversionFiles.map(({ file, format }, index) => (
                <li
                  key={file.name}
                  className="text-sm bg-[#F9F9F9] rounded-xl p-4 flex gap-4 items-center"
                >
                  <FileImage size={20} className="text-[#BBC9D7]" />

                  <span className="mr-auto">{file.name}</span>

                  <Select
                    value={format}
                    onValueChange={(value: ImageFormat) =>
                      dispatch({
                        type: "SET_FORMAT",
                        payload: { index, format: value },
                      })
                    }
                  >
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

                  {conversionFiles[index].loading && (
                    <Player src={loading} autoplay loop />
                  )}

                  {conversionFiles[index].result && (
                    <Player src={download} autoplay loop />
                  )}

                  {conversionFiles[index].error && (
                    <Player src={alert} autoplay loop />
                  )}
                </li>
              ))}
            </ul>
            {/* <p className="mt-6 text-sm text-muted-foreground text-right">
              {files.length} arquivos selecionados
            </p> */}
            {/* <div className="mt-6 text-right">
              <Button variant="secondary">Enviar</Button>
            </div> */}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
