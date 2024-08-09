import { NextPageContext } from "next";
import Custom400 from "./400";
import Custom401 from "./401";
import Custom404 from "./404";
import Custom500 from "./500";

interface ErrorProps {
  statusCode: number;
}

const Error = ({ statusCode }: ErrorProps) => {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
          <h1 className="text-9xl font-bold">{statusCode}</h1>
          <p className="text-2xl mt-4">An error occurred</p>
        </div>
      );
  }
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
