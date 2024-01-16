import Image from "next/image";
import { Inter } from "next/font/google";
import MutlipleSelectInput from "@/components/MutlipleSelectInput";
import { mockDetailedList } from "@/lib/mockdata";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col border-box items-center justify-center p-24 bg-slate-800 gap-2 ${inter.className}`}
    >
      <h1 className="text-2xl text-white/80"> Select Multiple Values </h1>
      <MutlipleSelectInput
        optionsList={mockDetailedList}
        onSelect={(e) => console.log(e)}
      />
    </main>
  );
}
