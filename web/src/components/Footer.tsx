const repoUrl = "https://github.com/lucassarcanjo/filefusion";

export const Footer = () => (
  <div className="w-full h-16 rounded-t-2xl bg-white text-muted-foreground shadow-xl flex justify-center items-center">
    <a href={repoUrl} target="_blank" className="hover:opacity-80">
      Made with 💙 using GitHub
    </a>
  </div>
);
