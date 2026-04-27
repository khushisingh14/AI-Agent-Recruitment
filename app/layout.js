import "./globals.css";
import Providers from "../Providers";
export const metadata = {
  title: "TalentAI",
  description: "AI-powered talent scouting and engagement workspace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
