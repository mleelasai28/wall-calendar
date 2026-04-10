import Head from "next/head";
import WallCalendar from "../components/WallCalendar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wall Calendar</title>
        <meta name="description" content="Interactive wall calendar with range selection and notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main>
        <WallCalendar />
      </main>
    </>
  );
}
