import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import ArConnectStrategy from "@arweave-wallet-kit/arconnect-strategy";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import {ThemeProvider} from "./components/theme-provider.jsx"
import "@fontsource/inter";
import Question from "./pages/Question.jsx";
import View from "./pages/View.jsx";
import Create from "./pages/Create.jsx";
import ViewPost from "./pages/ViewPost.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/app",
    element: <Question />,
  },
  {
    path: "/view",
    element: <View />,
  },
  {
    path: "/view/:postId",
    element: <ViewPost />,
  },
  {
    path: "/create",
    element: <Create />,
  },

  
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <ArweaveWalletKit
      config={{
        permissions: [
          "ACCESS_ADDRESS",
          "ACCESS_PUBLIC_KEY",
          "SIGN_TRANSACTION",
          "DISPATCH",
        ],
        ensurePermissions: true,
        strategies: [new ArConnectStrategy()],
      }}
    >
      <RouterProvider router={router} />
    </ArweaveWalletKit>
    </ThemeProvider>
  </React.StrictMode>
);
