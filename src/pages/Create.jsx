import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";
import Editor from "../components/Editor";

const Create = () => {
  const { connected } = useConnection();
  const processId = "9aGueINd4SC0y0B7J15LbIUoV_nXMw4V57AQnSEiqLo";
  const [isFetching, setIsFetching] = useState(false);
  const [authorList, setAuthorList] = useState([]);

  const activeAddress = useActiveAddress();

  const syncAllAuthors = async () => {
    console.log("Syncing all authors");
    if (!connected) {
      console.log("Not connected to the network");
      // setIsFetching(false);
      return;
    }

    try {
      const res = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "AuthorList" }],
        anchor: "1234",
      });
      console.log("Dry run Author result", res);
      const filteredResult = res.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered Author result", filteredResult);
      setAuthorList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }

    // setIsFetching(false);
  };

  const registerAuthor = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register-User" }],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register Author result", result);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    if (registerResult[0].Output[0].Data === "Registered user") {
      syncAllAuthors();
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllAuthors();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes author",
      authorList.some((author) => author.PID === activeAddress)
    );

    setIsFetching(false);
  }, [connected]);

  return (
    <main>
      <Header />
      <div className="h-[calc(100vh-72px)] flex flex-col p-10">
        <h2 className="text-center text-3xl">Welcome to ArweaveQuery</h2>
        {isFetching && <div>Fetching posts...</div>}
        <hr className="border-0 clear-both w-full bg-gray-300 h-px my-4" />
        {authorList.some((author) => author.PID === activeAddress) ? (
          <Editor />
        ) : (
          <button
            className="py-2 px-4 bg-black text-white border-none rounded cursor-pointer w-32"
            onClick={registerAuthor}
          >
            Register
          </button>
        )}
      </div>
    </main>
  );
};

export default Create;
