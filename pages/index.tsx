import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [responseText, setResponseText] = useState("");

  const prompt =
    "こんにちは！なんか最近花粉で辛いです。でもなんとか仕事してます。\nOutput:";

  const reset = () => {
    setResponseText("");
  };

  const request = async () => {
    const response = await fetch("/api/praise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setResponseText(lastMessage);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <button onClick={request}>Click Me</button>
        <button onClick={reset}>Reset</button>
        <div>{responseText}</div>
      </main>
    </>
  );
}
