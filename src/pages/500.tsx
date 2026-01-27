import Head from "next/head";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 — Server Error | Movie Magic</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h1 className="text-9xl font-bold">500</h1>
        <p className="text-2xl mt-4">Server-side error occurred</p>
      </div>
    </>
  );
}
