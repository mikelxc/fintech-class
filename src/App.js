import "./styles/App.css";
import dukeLogo from "./assets/duke-logo.png";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FinTechBlockChain from "./utils/FinTechBlockChain.json";

// Constants

const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 60;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x27ee108afde00aDeD11479137be6D9B122223E7E";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          FinTechBlockChain.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.registerFinTechBlockChain();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Your Student Account
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            Register FinTech 564 Blockchain
          </p>
          <p className="sub-text"></p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              Register This Class
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Duke Logo" className="logo" src={dukeLogo} />
          <a
            className="footer-text"
            href="https://duke.edu"
            target="_blank"
            rel="noreferrer"
          >{`built @ Duke`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
