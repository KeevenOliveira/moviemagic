import { NextPageContext } from "next";
import Head from "next/head";
import Custom400 from "./400";
import Custom401 from "./401";
import Custom404 from "./404";
import Custom500 from "./500";

interface ErrorProps {
  statusCode: number;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
  const title =
    statusCode === 404
      ? "404 — Page Not Found | Movie Magic"
      : statusCode === 500
        ? "500 — Server Error | Movie Magic"
        : statusCode === 401
          ? "401 — Unauthorized | Movie Magic"
          : statusCode === 400
            ? "400 — Bad Request | Movie Magic"
            : `${statusCode} — Error | Movie Magic`;

  switch (statusCode) {
    case 400:
      return <Custom400 />;
    case 401:
      return <Custom401 />;
    case 404:
      return <Custom404 />;
    case 500:
      return <Custom500 />;
    default:
      return (
        <>
          <Head>
            <title>{title}</title>
            <meta name="robots" content="noindex" />
          </Head>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-9xl font-bold">{statusCode}</h1>
            <p className="text-2xl mt-4">An error occurred</p>
          </div>
        </>
      );
  }
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
