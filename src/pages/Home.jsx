import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main>
      <Header />
      <div className="h-[calc(100vh-72px)] flex flex-col items-center justify-center">
        <h2 className="text-7xl mb-10">Welcome to ArweaveQuery!</h2>
        {connected ? (
          <button className="py-2 px-4 bg-black text-white border-none rounded cursor-pointer">
            <Link to="/view" className="text-white no-underline text-2xl">
              View Posts
            </Link>
          </button>
        ) : (
          <ConnectButton />
        )}
      </div>
    </main>
  );
};

export default Home;
