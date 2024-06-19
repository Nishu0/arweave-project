import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = () => {
  const [draftContent, setDraftContent] = useState("");
  const [errorContent,setErrorContent]= useState("");
  const [codeContent,setCodeContent]= useState("");
  const [title, setTitle] = useState("");
  const [discord, setDiscord] = useState("");
  const [os, setOs] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const { connected } = useConnection();
  const processId = "9aGueINd4SC0y0B7J15LbIUoV_nXMw4V57AQnSEiqLo";

  const createPost = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(title, discord, os,draftContent, errorContent, codeContent);

    if (!connected) {
      return;
    }

    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Create-Post" },
          { name: "Content-Type", value: "text/html/json" },
          { name: "Title", value: title },
          {name:"Discord", value: discord},
          {name:"OS", value: os},
          {name:"Error", value: errorContent},
          {name:"Code", value: JSON.stringify(codeContent)}
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
      setDiscord("");
      setOs("");
      setErrorContent("");
      setCodeContent("");
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  return (
    <form className="flex flex-col">
      <div className="grid grid-cols-3 gap-28">
  <div>
    <span className="text-lg mb-5 block">Add a title</span>
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Question Title"
      className="mb-5 w-64 border-2 border-gray-300 rounded p-1 block"
    />
  </div>
  <div>
    <span className="text-lg mb-5 block">Discord user ID</span>
    <input 
      type="text"
      value={discord}
      onChange={(e) => setDiscord(e.target.value)}
      placeholder="Discord User ID"
      className="mb-5 w-64 border-2 border-gray-300 rounded p-1 block"
    />
  </div>
  <div>
    <span className="text-lg mb-5 block">OS</span>
    <input 
      type="text"
      value={os}
      onChange={(e) => setOs(e.target.value)}
      placeholder="Operation System are you using?"
      className="mb-5 w-64 border-2 border-gray-300 rounded p-1 block"
    />
  </div>
</div>
      <span className="text-lg">Describe your question in detail.</span>
      <span className="text-xs mb-5">For example how do you get all transactions for a user?</span>
      <ReactQuill
        theme="snow"
        value={draftContent}
        onChange={setDraftContent}
        className="mb-11"
      />
      <span className="text-lg mt-5">What error, if any, are you getting?</span>
      <span className="text-xs mb-5">If there is no error, you can leave this field blank.</span>
      <ReactQuill
        theme="snow"
        value={errorContent}
        onChange={setErrorContent}
        className="mb-11"
      />
      <span className="text-lg mt-5">What have you tried or looked at? Or how can we reproduce the error?</span>
      <span className="text-xs mb-5">Write Text only how to reproduce error?</span>
      <ReactQuill
        theme="snow"
        value={codeContent}
        onChange={setCodeContent}
        className="mb-11"
      />
      {isPosting && <div className="mb-5">Posting...</div>}
      <button
        className="py-2 px-4 bg-black text-white border-none rounded-lg cursor-pointer w-64 mt-5 mb-5"
        type="submit"
        disabled={isPosting || (title === "" && draftContent === "" && errorContent === "" && codeContent === "" && discord === "" && os === "")}
        onClick={(e) => createPost(e)}
      >
        Create Post
      </button>
    </form>
  );
};

export default Editor;
