import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
    <div className="max-w-7xl w-full">
        <Hero />
        </div>
    </main>
  );
};

export default Home;
