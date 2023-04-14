import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  TextInput,
  Textarea,
} from "@mantine/core";
import { log } from "console";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [responseText, setResponseText] = useState("");

  const prompt = `#contents
  [
  {
  "fieldId": "7OxK8vWm2V",
  "fieldName": "タイトル",
  "content": "Datadogの外形監視でログインできない問題"
  },
  {
  "fieldId": "kUuAj-FfPU",
  "fieldName": "概要",
  "content": "undefined"
  },
  // {
  // "fieldId": "TUih6BRWnR",
  // "fieldName": "本文",
  // "content": "undefined"
  // },
  {
  "fieldId": "yU2QE9YmvZ",
  "fieldName": "カテゴリ",
  "content": "null"
  },
  {
  "fieldId": "VaLbjTNGLF",
  "fieldName": "タグ",
  "content": "Datadog, ログ分析"
  },
  ]
  
  #constraints
  contents format is here:
  ===========================
  7OxK8vWm2V: string, required, up to 30 words
  kUuAj-FfPU: string, optional, up to 200 words
  // TUih6BRWnR: markdown
  yU2QE9YmvZ: select one from ["更新情報", "チュートリアル", "コラム"]
  VaLbjTNGLF: select multiple from ["Next", "Nuxt", "Flutter", "Swift"]
  ===========================
  
  #task
  - 「全てのフィールドにランダムな値を生成してください」
  
  #OutputFormat
  Output text is "[fieldId]content". example is following:
  --------------
  [9fds1S90fd]
  これはタイトルです
  [kfgds3fdDa]
  これは概要です
  [end]
  --------------`;

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

      // parseする
      let sentences = lastMessage.split("[");
      console.log(sentences);

      for (var sentence of sentences) {
        const keyValue = sentence.split("]");
        console.log(keyValue);

        if (keyValue.length < 2) {
          continue;
        }

        const key = keyValue[0];
        const value = keyValue[1];

        if (key == "7OxK8vWm2V") {
          setTitle(value);
        } else if (key == "kUuAj-FfPU") {
          setDescription(value.trim());
        } else if (key == "yU2QE9YmvZ") {
          setCategory(value.trim());
        } else if (key == "VaLbjTNGLF") {
          setTags(value.trim());
        }
      }
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  return (
    <main>
      <div className="container mx-auto mt-32">
        <Group position="center">
          <TextInput className="w-64" value="ランダムに値を生成してください" />
          <Button onClick={request}>Generate Text</Button>
        </Group>
        <Flex className="mt-24">
          <Box className="w-1/2 mr-16 text-gray-600 leading-relaxed bg-gray-100 rounded min-h-72 p-8">
            {responseText ? (
              responseText
            ) : (
              <div className="text-center text-gray-500 text-sm">
                AIが生成したテキストがここに表示されます
              </div>
            )}
          </Box>
          <Box className="w-1/2">
            <TextInput
              value={title}
              label="タイトル (7OxK8vWm2V)"
              onChange={(event) => setTitle(event.currentTarget.value)}
            />

            <Textarea
              value={description}
              label="概要 (kUuAj-FfPU)"
              className=" mt-8"
              onChange={(event) => setDescription(event.currentTarget.value)}
            />

            <TextInput
              value={category}
              label="カテゴリ (yU2QE9YmvZ)"
              className=" mt-8"
              onChange={(event) => setCategory(event.currentTarget.value)}
            />

            <TextInput
              value={tags}
              label="タグ (VaLbjTNGLF)"
              className="mt-8"
              onChange={(event) => setTags(event.currentTarget.value)}
            />
          </Box>
        </Flex>
      </div>
    </main>
  );
}
