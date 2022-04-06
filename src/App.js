import "./styles/App.css";
import dukeLogo from "./assets/duke-logo.png";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FinTechBlockChain from "./utils/FinTechBlockChain.json";
import DukeUniversityCredit from "./utils/DukeUniversityCredit.json";

// Constants
const CONTRACT_ADDRESS = "0x27ee108afde00aDeD11479137be6D9B122223E7E";
const OPENSEA_LINK =
  "https://testnets.opensea.io/collection/fintechblockchain-v2";
const TOTAL_MINT_COUNT = 60;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [registered, setRegistered] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      FinTechBlockChain.abi,
      signer
    );
    const balance = await connectedContract.balanceOf(currentAccount);
    balance > 0 && setRegistered(true);
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

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
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
        {registered ? (
          <div className="header-container">
            <p className="header gradient-text">
              Welcome to FinTech 564 Blockchain
            </p>
            <p className="sub-text">
              FINTECH 564 – Blockchain Spring 2022 <br />
              Instructor: Jimmie Lenz
              <br />
              Class Meetings: Wed 8:30-11:15 <br />
              Office Hours: On Request <br />
              Phone: 314-919-6114 <br />
              Teaching Assistants: Ruicheng Peng <br />
              TA Emails: Ruicheng.Peng@duke.edu <br />
              Course Description: Blockchain technology is being embraced in
              finance and other industries as an encryption base for all types
              of applications. This course explores the history, current
              environment, and near-term outlook of financial innovation
              (FinTech), focusing on applications of Blockchain technology.
              Topics range from digital stores of value to documents and
              transactions. This course is designed to provide students with
              perspective and hands-on experience using a blockchain. Students
              will learn to formulate an accurate image and deep practical
              understanding of the capabilities and limitations of various
              blockchain techniques. Finance may be the most disruptive (and
              disrupted) industry in existence today, Blockchain is playing a
              significant role in what is currently characterized as “FinTech.”
              The immutability and transparency of the technology is
              facilitating both traditional transactions (such as credit, supply
              chain and voting) as well as new areas (e.g. IOT, digital
              currencies, and identity management). Given the breadth of
              applications of this technology, the potential impact on finance
              and beyond cannot be overstated. As with many FinTech
              applications, Blockchain opportunities occupy both technical and
              business settings. This course is designed to provide a good
              understanding (via discussion, implementation, and execution) and
              level of competence in this area, with a particular focus on
              certain aspects that are proving to be especially disruptive. To
              further these objectives, several speakers that are squarely
              entrenched in the Blockchain space will present their views on
              various aspects of the industry, as well as discussing their
              motivation for forming their own companies where applicable. In
              addition to speakers, we will discuss various assigned readings.
              The goal of this course is that you leave with not only knowledge
              but hands on experience creating a simple Blockchain contract. In
              addition, you will be able to converse on a practical basis about
              what Blockchain can and cannot do (e.g. blockchain will not cure
              cancer but may facilitate research). This understanding is among
              the most sought after in today’s job market. REMEMBER THIS IS A
              VERY DYNAMIC TECHNOLOGY, LIKELY THE MOST DYNAMIC THAT YOU WILL
              STUDY HERE, THE SYLLABUS WILL CHANGE TO REFLECT THINGS THAT ARE
              HAPPENING IN BLOCKCHAIN, DIGITAL CURRENCY, NFT’S, ETC.
            </p>
          </div>
        ) : (
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
        )}
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
