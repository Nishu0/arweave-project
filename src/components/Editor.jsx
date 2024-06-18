import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  const [draftContent, setDraftContent] = useState("");
  const [title, setTitle] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { connected } = useConnection();
  const processId = "5iK7nXtoUMWNCDtiOpwf75_ppw0v4LwusumyqiQdPq8";

  const createPost = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!connected) {
      return;
    }

    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Create-Post" },
          { name: "Content-Type", value: "text/html" },
          { name: "Title", value: title },
        ],
        data: draftContent,
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Post result", res);

      const postResult = await result({
        process: processId,
        message: res,
      });

      console.log("Post Created successfully", postResult);

      setDraftContent("");
      setTitle("");
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  return (
    <form className="flex flex-col">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mb-5 w-64 border-2 border-gray-300 rounded p-1"
      />
      <ReactQuill
        theme="snow"
        value={draftContent}
        onChange={setDraftContent}
        className="mb-5"
      />
      {isPosting && <div className="mb-5">Posting...</div>}
      <button
        className="py-2 px-4 bg-black text-white border-none rounded cursor-pointer w-64 mt-5"
        type="submit"
        disabled={isPosting || (title === "" && draftContent === "")}
        onClick={(e) => createPost(e)}
      >
        Create Post
      </button>
    </form>
  );
};

export default Editor;
