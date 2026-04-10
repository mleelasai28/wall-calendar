"use client";

import dynamic from 'next/dynamic';

const WallCalendar = dynamic(() => import('../WallCalendar'), { ssr: false });

export default function Page() {
  return <WallCalendar />;
}
