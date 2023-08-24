// NFTAuction.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
const AuctionContract = require("../Abis.json");

export const web3 = new Web3(window.web3 && window.web3.currentProvider);

const NFTAuction = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [nfts, setNFTs] = useState([]);
  const [bidAmount, setBidAmount] = useState(""); 

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        console.log(accounts[0]);
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(
          AuctionContract,
          "0xf84c93B960D45918936598f5D513B5F5aC0A905d"
        );
        console.log(contractInstance);
        setContract(contractInstance);
      } else {
        console.error("Web3 not found");
      }
    }

    initWeb3();
  }, []);

  const fetchNFTs = async () => {
    if (contract && web3) {
      const nftList = [];
      const tokenCount = await contract.methods.totalSupply().call();
  
      for (let i = 0; i < tokenCount; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call();
        const nft = await contract.methods.nfts(tokenId).call();
        nftList.push({ tokenId, ...nft });
      }
  
      setNFTs(nftList);
    }
  };

  const placeBid = async (tokenId) => {
    if (contract && web3 && bidAmount !== "") {
      const bidValue = web3.utils.toWei(bidAmount, "ether");
      await contract.methods.placeBid(tokenId).send({ from: account, value: bidValue });
      setBidAmount(""); 
    }
  };

  return (
    <div>
      <h1>NFT Auction</h1>
      <button onClick={fetchNFTs}>Fetch NFTs</button>
      <div>
        {nfts.map((nft) => (
          <div key={nft.tokenId}>
            <h3>{nft.name}</h3>
            <p>Description: {nft.description}</p>
            <p>Highest Bidder: {nft.highestBidder}</p>
            <p>Highest Bid: {web3 && web3.utils.fromWei(nft.highestBid.toString(), "ether")} ETH</p>
            <input
              type="text"
              placeholder="Bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button onClick={() => placeBid(nft.tokenId)}>Place Bid</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTAuction;
