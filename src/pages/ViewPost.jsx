import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const ViewPost = () => {
  const { postId } = useParams();
  const { connected } = useConnection();

  const processId = "9aGueINd4SC0y0B7J15LbIUoV_nXMw4V57AQnSEiqLo";
  const [isFetching, setIsFetching] = useState(false);
  const [postContent, setPostContent] = useState();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Get" },
          { name: "Post-Id", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      setPostContent(filteredResult[0]);
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
      {postContent && (
        <div className="h-[calc(100vh-72px)] flex flex-col p-10">
          <h2 className="m-0 p-0">{postContent.Title}</h2>
          <p className="m-0 p-0 text-gray-600 text-sm">{postContent.Author}</p>
          <p className="m-0 p-0 text-gray-600 text-sm">{postContent.ID}</p>
          <Link to="/view" className="no-underline text-white">
            <button className="py-2 px-4 bg-black text-white border-none rounded cursor-pointer w-24 mt-5">
              Back
            </button>
          </Link>
          <hr className="border-0 w-full bg-gray-300 h-px my-4" />
          <span>Question in detail:</span>
          <ReactQuill value={postContent.Body} readOnly theme="bubble" className="text-xl" />
          <span>Error</span>
          <ReactQuill value={postContent.Error} readOnly theme="bubble" />
          <span>Code</span>
          <ReactQuill value={postContent.Code} readOnly theme="bubble" />
        </div>
      )}
    </main>
  );
};

export default ViewPost;
