import React, { useState } from "react";
import Head from "next/head";
import FormComponent from "../component/molecules/formComponent";

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
          <h1 className="px-5 mb-8 text-4xl font-bold leading-tight tracking-tight text-center sm:mt-4 sm:text-6xl">
            Steganographia
          </h1>
          <h4 className="text-center sm:mt-4">
            We help image authors and meme creators claim ownership over their
            work.
          </h4>
          <h4 className="mb-8 text-center">
            Please specify your name and upload an image to claim ownership over
            it.
          </h4>
          <FormComponent />
        </div>
      </main>
    </div>
  );
}
