import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner, message, result, dryrun } from "@permaweb/aoconnect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css"; // Import Quill snow theme for the comment editor

const ViewPost = () => {
  const { postId } = useParams();
  const { connected } = useConnection();

  const processId = "9aGueINd4SC0y0B7J15LbIUoV_nXMw4V57AQnSEiqLo";
  const [isFetching, setIsFetching] = useState(false);
  const [comments, setComments] = useState([]);
  const [postContent, setPostContent] = useState();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comment, setComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const syncAllPosts = async () => {
    console.log(postId)
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Get-Post" },
          { name: "Post-Id", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      setPostContent(filteredResult[0]);

      const commentsResult = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "GetComments" },
          { name: "Post-Id", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Comments dry run result", commentsResult);
      const filteredComment = JSON.parse(commentsResult.Messages[0].Data);
      console.log("Filtered result", filteredComment);
      setComments(filteredComment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    if (!connected) {
      return;
    }
    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Like-Post" },
          { name: "Post-Id", value: postId },
        ],
        data: "",
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Like result", res);

      const likeResult = await result({
        process: processId,
        message: res,
      });

      console.log("Like action successful", likeResult);
      setLikes(likes + 1);
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  const handleDislike = async () => {
    if (!connected) {
      return;
    }
    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Dislike-Post" },
          { name: "Post-Id", value: postId},
        ],
        data: "",
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Dislike result", res);

      const dislikeResult = await result({
        process: processId,
        message: res,
      });

      console.log("Dislike action successful", dislikeResult);
      setDislikes(dislikes + 1);
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleCommentSubmit = async () => {
    if (!connected) {
      return;
    }
    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Add-Comment" },
          { name: "Post-Id", value: postId },
          { name: "Comment", value: comment}
        ],
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Comment result", res);

      const commentResult = await result({
        process: processId,
        message: res,
      });

      console.log("Comment submitted successfully", commentResult);
      setComment(""); // Reset the comment field after submission
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
  };

  const handleHighlightComment = async (commentId) => {
    if (!connected) {
      return;
    }
    setIsPosting(true);

    try {
      const res = await message({
        process: processId,
        tags: [
          { name: "Action", value: "Highlight-Comment" },
          { name: "Comment-Id", value: commentId },
          { name: "Post-Id", value: postId },
        ],
        data: "",
        signer: createDataItemSigner(window.arweaveWallet),
      });

      console.log("Highlight result", res);

      const highlightResult = await result({
        process: processId,
        message: res,
      });

      console.log("Highlight action successful", highlightResult);
      // Optionally refresh comments to reflect the highlighted comment
      syncAllPosts();
    } catch (error) {
      console.log(error);
    }

    setIsPosting(false);
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
          <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-bold mb-2">{postContent.Title}</h2>
            <p className="text-gray-600 text-sm">{postContent.Author}</p>
            <p className="text-gray-600 text-sm">{postContent.ID}</p>
            <Link to="/view" className="no-underline text-white">
              <button className="py-2 px-4 bg-black text-white border-none rounded cursor-pointer w-24 mt-5">
                Back
              </button>
            </Link>
            <hr className="border-0 w-full bg-gray-300 h-px my-4" />
            <span className="block mb-2">Question in detail:</span>
            <ReactQuill value={postContent.Body} readOnly theme="bubble" className="mb-4" />
            <span className="block mb-2">Error:</span>
            <ReactQuill value={postContent.Error} readOnly theme="bubble" className="mb-4" />
            <span className="block mb-2">Code:</span>
            <ReactQuill value={postContent.Code} readOnly theme="bubble" className="mb-4" />

            <div className="flex gap-2">
              <button className="py-2 px-4 bg-blue-500 text-white border-none rounded cursor-pointer" onClick={handleLike} disabled={isPosting}>
                Like ({postContent.Likes})
              </button>
              <button className="py-2 px-4 bg-red-500 text-white border-none rounded cursor-pointer" onClick={handleDislike} disabled={isPosting}>
                Dislike ({postContent.Dislikes})
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-xl font-bold mb-4">Comments:</h3>
            <div className="ml-6">
              {comments.map((comment) => (
                <div key={comment.CommentID} className={`mb-4 p-4 border rounded ${comment.Highlighted ? 'bg-green-100' : ''}`}>
                  <p className="text-gray-600 text-sm">{comment.Author}</p>
                  <ReactQuill value={comment.Comment} readOnly theme="bubble" className="mb-2" />
                  <button className="py-1 px-2 bg-yellow-500 text-white border-none rounded cursor-pointer" onClick={() => handleHighlightComment(comment.CommentID)} disabled={isPosting}>
                    Highlight
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-xl font-bold mb-2">Add a Comment:</h3>
            <ReactQuill value={comment} onChange={handleCommentChange} theme="snow" className="mb-2" />
            <button className="py-2 px-4 bg-green-500 text-white border-none rounded cursor-pointer mt-2" onClick={handleCommentSubmit} disabled={isPosting}>
              Submit Comment
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ViewPost;
