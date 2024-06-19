import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { tag: "24/7 Developer Assistance", description: "Get round-the-clock support from experienced Arweave developers." },
  { tag: "Stay Informed with Community News", description: "Never miss an update with real-time news and insights from the Arweave community." },
  { tag: "Comprehensive Arweave Solutions", description: "Find answers to all your Arweave-related questions." },
  { tag: "Expert-Led Developer Insights", description: "Benefit from the knowledge and experience of top Arweave developers." }
];

const Question = () => {
  const { connected } = useConnection();

  return (
    <main className="bg-gray-100 text-gray-900">
      <Header />
      <div className="h-[calc(100vh-72px)] flex flex-col items-center justify-center space-y-6">
        <motion.h2 
          className="text-3xl font-bold text-center" 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          Welcome to ArweaveQuery!
        </motion.h2>

        {connected ? (
          <motion.button 
            className="py-2 px-4 bg-black text-white border-none rounded cursor-pointer shadow-lg" 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
          >
            <Link to="/view" className="text-white no-underline">
              View Posts
            </Link>
          </motion.button>
        ) : (
          <ConnectButton />
        )}

        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-lg"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="p-4 bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-semibold text-lg mb-2">{feature.tag}</h3>
              <p className="text-sm text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default Question;
