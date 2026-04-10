import "../_app.css";

export const metadata = {
  title: "Wall Calendar",
  description: "Interactive wall calendar built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
