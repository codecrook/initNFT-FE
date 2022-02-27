import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

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

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
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