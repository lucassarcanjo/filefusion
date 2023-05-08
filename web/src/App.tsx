import { useRef } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

import fileMoving from "./assets/file-moving.json";

function App() {
  const playerRef = useRef<Player>(null);

  return (
    <main className="h-screen bg-gradient-to-b from-[#EEF4FA] to-[#CFE2F7] flex items-center justify-center">
      <section
        className="bg-white p-7 rounded-3xl shadow-xl h-[400px] w-[600px]"
        onMouseEnter={() => playerRef.current?.play()}
      >
        <div className="rounded-[20px] bg-[#F2F6FC] w-full h-full border-2 border-dashed border-[#BBC9D7] flex items-center justify-center flex-col p-4">
          <div className="w-[250px] h-[250px]">
            <Player ref={playerRef} src={fileMoving} />
          </div>
          <p className="text-lg  text-center text-muted-foreground">
            Arraste aqui as imagens que você deseja converter. Elas vão ser
            enviados automaticamente.
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
