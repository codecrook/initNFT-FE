import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const CONTRACT_ADDRESS = "CA";

  // function to setup event listener.
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  // function to check if MetaMask connected
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('MetaMask not available');
      return;
    } else {
      console.log('Etherium Available:', ethereum);
    }

    // set the current account if authorized accounts are found
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const [account] = accounts;
      console.log('Found Authorized Account:', account);
      setCurrentAccount(account);

      setupEventListener();
    } else {
      console.log('Authorized Account not Found!');
    }
  }

  // function to request for MetaMask wallet connection
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) { alert('Get MetaMask to Continue'); return; }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Account Connected Successfully:", accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error in connecting wallet:", error);
    }
  };

  // function to mint the NFT
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    currentAccount === '' ?
      <button className="cta-button connect-wallet-button" onClick={connectWallet}
      >
        Connect to Wallet
      </button>
      :
      <button className="cta-button connect-wallet-button" onClick={askContractToMintNft}>
        Mint NFT
      </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
      </div>
    </div>
  );
};

export default App;