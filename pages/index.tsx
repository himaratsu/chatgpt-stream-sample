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
    "こんにちは！なんか最近花粉で辛いです。でもなんとか仕事してます";

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

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    let answer = await response.text();
    console.log(answer);

    setResponseText(answer);

    // await axios({
    //   url: "/api/praise",
    //   method: "POST",
    //   data: { prompt },
    //   onDownloadProgress: (progressEvent: any) => {
    //     const dataChunk = progressEvent.event.target.response;
    //     setResponseText(dataChunk);
    //   },
    // }).catch(() => {});
  };

  // useEffect(() => {
  //   request();
  // }, []);

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
