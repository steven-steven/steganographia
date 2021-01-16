import React from "react";
import Head from "next/head";
import Link from "next/link";
import UploadComponent from "../component/uploadComponent";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Steganographia</title>
        <meta
          name="description"
          content="a stegastamp wrapper, that will put a invisible watermark on your image"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center min-h-screen py-20 bg-gradient-to-b from-geist-50 via-geist-50 to-geist-100">
        <div>
          <h1 className="px-5 text-4xl font-bold leading-tight tracking-tight text-center sm:mt-4 sm:text-6xl">
            Steganographia
          </h1>

          <form
            action="/incidents/upload"
            method="post"
            encType="multipart/form-data"
          >
            <UploadComponent />
          </form>
        </div>
      </main>
    </div>
  );
}
