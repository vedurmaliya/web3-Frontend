// src/App.js
import React, { useState, useEffect } from "react";
import NFTAuction from "./components/NFTAuction";

const App = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } else {
        console.error("Web3 not found");
      }
    }

    loadWeb3();
  }, []);

  return (
    <div className="App">
      <h1>NFT Auction Platform</h1>
      {account ? (
        <NFTAuction account={account} />
      ) : (
        <p>Connect your wallet to access the NFT auction platform.</p>
      )}
    </div>
  );
};

export default App;



