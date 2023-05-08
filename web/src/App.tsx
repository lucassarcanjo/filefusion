import { useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

import fileMoving from "./assets/file-moving.json";
import { Separator } from "./components/Separator";
import { Button } from "./components/Button";

function App() {
  const [dragActive, setDragActive] = useState(false);

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
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // handleFiles(e.target.files);
      console.log("change");
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

            <label htmlFor="picture">
              <Button
                className="bg-[#3A55F3] font-bold"
                onClick={() => fileInputRef.current?.click()}
              >
                Procurar arquivos
              </Button>
              <input
                multiple
                id="picture"
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChange}
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
      </section>
    </main>
  );
}

export default App;
