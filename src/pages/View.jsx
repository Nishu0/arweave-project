import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import { Outlet } from "react-router-dom";

const View = () => {
  const { connected } = useConnection();
  const processId = "9aGueINd4SC0y0B7J15LbIUoV_nXMw4V57AQnSEiqLo";
  const [isFetching, setIsFetching] = useState(false);
  const [postList, setPostList] = useState();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "List" }],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setPostList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected]);

  return (
    <main>
      <Header />
      <div className="h-[calc(100vh-72px)] flex flex-col p-10">
        <h2>Welcome to the View Page</h2>
        {isFetching && <div>Fetching posts...</div>}
        <hr className="border-0 w-full bg-gray-300 h-px my-4" />
        {postList &&
          postList.map((post, index) => (
            <div
              key={index}
              className="p-5 border border-gray-300 rounded-lg flex flex-col gap-1.5 mb-4 bg-white shadow-md"
            >
              <a href={`/view/${post.ID}`} className="m-0 p-0 text-blue-600">
              <h3 className="m-0 p-0 text-xl font-semibold text-gray-900">
                {post.Title}
              </h3>
              <a
                href={`https://discord.com/users/${post.Discord}`}
                className="m-0 p-0 text-blue-600 text-sm"
              >
                Discord: {post.Discord}
              </a>
              <span className="block">
                Author: {post.Author}
              </span>
              
              </a>
            </div>
          ))}
        <hr className="border-0 w-full bg-gray-300 h-px my-4" />
      </div>
      <Outlet />
    </main>
  );
};

export default View;
