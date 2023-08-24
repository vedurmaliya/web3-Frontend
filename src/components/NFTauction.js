import React, { useState, useEffect } from "react";
import Web3 from "web3";
const CONTRACT_BUILD = require("../Abis.json");

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
          CONTRACT_BUILD.AuctionAbi,
          "0x6e4eaF622f64fac61f43AC75EED3e3962650fD24"
        );
        console.log(contractInstance);
        setContract(contractInstance);
        await fetchNFTs();
      } else {
        console.error("Web3 not found");
      }
    }
    initWeb3();
  }, []);

  const fetchNFTs = async () => {
    if (contract) {
      console.log("function called");
      const nftList = [];

      const totalNFTs = await contract.methods.totalNFTs().call();
      console.log(totalNFTs);

      for (let i = 0; i < totalNFTs; i++) {
        try {
          console.log("called");
          const tokenId = i;
          const nft = await contract.methods.nfts(tokenId).call();
          nftList.push({ tokenId, ...nft });
        } catch (error) {
          break; // Stop the loop if there's an error
        }
      }
      console.log(nftList);
      setNFTs(nftList);
    }
  };


  const placeBid = async (tokenId) => {
    if (contract && web3 && bidAmount !== "") {
      console.log(bidAmount);
      // const bidValue = web3.utils.toWei(bidAmount, "ether");
      await contract.methods.placeBid(tokenId).send({ from: account, value: bidAmount });
      setBidAmount("");
      window.location.reload();
    }
  };

  return (
    <div>
      <h1>NFT Auction</h1>
      <div>
        {nfts && nfts.map((nft) => (
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
