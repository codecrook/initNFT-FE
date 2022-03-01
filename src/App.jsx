import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';
import Button from './components/Button';

import './App.css';
import NFTLinkDisplay from './components/NFTLinkDisplay';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [generatedNFT, setGeneratedNFT] = useState('');
  const [minting, setMinting] = useState(false);
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
          setGeneratedNFT(tokenId);
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

    // check if the user is on Rinkeby chain
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return;
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

        console.log("Mining...please wait.");
        setMinting(true);
        await nftTxn.wait();
        setMinting(false);

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const isReadyToMint = currentAccount !== '';
  const clickHandler = isReadyToMint ? askContractToMintNft : connectWallet;

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <Button className="cta-button connect-wallet-button" onClick={clickHandler}>
            {isReadyToMint ? 'Mint NFT' : 'Connect to Wallet'}
          </Button>
        </div>
        {minting && <p className="sub-text">Mining...please wait.</p>}
        {
          (generatedNFT && !minting) &&
          <NFTLinkDisplay contract={CONTRACT_ADDRESS} generatedNFT={generatedNFT} />
        }
      </div>
    </div>
  );
};

export default App;