// src/components/NFTAuction.js
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AuctionContract from "../contracts/Auction.json";

const NFTAuction = ({ account }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    async function initWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = AuctionContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          AuctionContract.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
      } else {
        console.error("Web3 not found");
      }
    }

    initWeb3();
  }, []);

  const fetchNFTs = async () => {
    if (contract && web3) {
      const totalSupply = await contract.methods.totalSupply().call();
      const nftList = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.methods.tokenByIndex(i).call();
        const nft = await contract.methods.nfts(tokenId).call();
        nftList.push({ tokenId, ...nft });
      }

      setNFTs(nftList);
    }
  };

  const placeBid = async (tokenId, bidAmount) => {
    if (contract && web3) {
      const bidValue = web3.utils.toWei(bidAmount, "ether");
      await contract.methods.placeBid(tokenId).send({ from: account, value: bidValue });
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
            <p>Highest Bidder: {nft.highestBidder}</p>
            <p>Highest Bid: {web3 && web3.utils.fromWei(nft.highestBid.toString(), "ether")} ETH</p>
            <input type="text" placeholder="Bid amount" onChange={(e) => setBidAmount(e.target.value)} />
            <button onClick={() => placeBid(nft.tokenId, bidAmount)}>Place Bid</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTAuction;
