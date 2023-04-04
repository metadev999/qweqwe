import React, { useState, useEffect } from "react";
import connectToWallet from "./getWeb3";
import Moralis  from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
import StakerContract from "./contracts/Staker.json";
import ERC20ABI from "./ERC20ABI.json";
import BlockchainContext from "./context/BlockchainContext.js";
import DisplayContext from "./context/DisplayContext.js";
 
import NavBar from "./components/NavBar";
import AdminPanel from "./tosatsuyucomponents/AdminPanel";
import UserPanel from "./tsuyutosacomponents/UserPanel";


import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner' 
import "./App.css";

//import timelocks from './timelock.js' 


function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [stakerContract, setStakerContract] = useState(undefined);
  const [depositTokenContract, setDepositTokenContract] = useState(undefined);
  const [rewardTokenContract, setRewardTokenContract] = useState(undefined);

  const [userDetails, setUserDetails] = useState({});
  const [owner, setOwner] = useState(undefined);

  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isConnectingToWallet, setIsConnectingToWallet] = useState(false);

 

  useEffect(() => {
    (async () => {
      setIsGlobalLoading(false);
      /*window.addEventListener("load", async () => {
        try {
        }
        catch(e) {

        }
      });*/
    })();

  }, []);



  async function initConnection() {

  
    try {
      // Get network provider and web3 instance.
      setIsConnectingToWallet(true);
      const web3 = await connectToWallet();

      setIsGlobalLoading(true);
      // Use web3 to get the user's accounts.
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      // Get the contract instance.
      const networkId = await window.ethereum.request({ method: 'net_version' });
      const deployedNetwork = StakerContract.networks[networkId];
      const instance = new web3.eth.Contract(
        StakerContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      
  //instance.options.address = "0xAcE11d70D31024Bd71F8867F6d97579Fb2692863";

 
      instance.options.address = "0xD18e25307C41E05C7A84b81Ecc52390723a8F7D0";
     ///testnet 0x5840A10D66B70c3C80E10E94aE964Aaa787C8F5A
     /// mainet 0xAcE11d70D31024Bd71F8867F6d97579Fb2692863
   /// partner instance.options.address = "0x430CA6a95a27c44B1c5ead7e1A0a1392620e246c";
  // tosaxtsuyu test 0x082f476eD0Bf2F0746B6755073d3BEefd2E941Fe


   const depositTokenAddr = await instance.methods.depositToken().call({ from: accounts[0] });
      console.log((depositTokenAddr),"deposit tosa")
     
      


      const depositContract = new web3.eth.Contract(ERC20ABI, depositTokenAddr);



      const rewardTokenAddr = await instance.methods.rewardToken().call({ from: accounts[0] });
      console.log((rewardTokenAddr),"reward tosa")

      const rewardContract = new web3.eth.Contract(ERC20ABI, rewardTokenAddr);

      setWeb3(web3);
     setOwner(owner);
 setOwner("0xB533Aff54aba2C641dDAFe8B555dA2a5b525efD9");
     
    // setOwner(await instance.methods.owner().call({ from: accounts[0] }));
      setAccounts(accounts);
      setStakerContract(instance);
      setDepositTokenContract(depositContract);
      setRewardTokenContract(rewardContract);

      window.ethereum.on('accountsChanged', function (_accounts) {
        if (_accounts.length === 0) {
          setAccounts(undefined);
          setWeb3(undefined);
        }
        else {
          setAccounts(_accounts);
        }
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      if (error.code === 4001) {
        // User denied access to wallet
        return;
      }
      if (error.toString().includes("This contract object doesn't have address set yet")) {
        toast.error("Error: can't load contract. Are you on the right network?");
        console.error(error);
        return;
      }
      alert("Error: can't load web3 connection. Please check console . Select Ethereum Mainnet Network");
      console.error(error);

    } finally {
      setIsGlobalLoading(false);
      setIsConnectingToWallet(false);
    }
  }


  useEffect(() => {
    const load = async () => {
      await refreshUserDetails();
    }

    if (typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      && typeof stakerContract !== 'undefined'
      && typeof depositTokenContract !== 'undefined'
      && typeof rewardTokenContract !== 'undefined') {
      load();
    }
  }, [web3, accounts, stakerContract, depositTokenContract, rewardTokenContract]) // eslint-disable-line react-hooks/exhaustive-deps


  async function refreshUserDetails() {
    setIsGlobalLoading(true);


    let res = await stakerContract.methods.getFrontendView().call({ from: accounts[0] });
    let depBalance = await depositTokenContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
    let rewardBalance = await rewardTokenContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
    let depSymbol = await depositTokenContract.methods.symbol().call({ from: accounts[0] });
    let rewSymbol = await rewardTokenContract.methods.symbol().call({ from: accounts[0] });



    let parsed = {
      rewardPerDay: (res["_rewardPerSecond"] * 24 * 60 * 60 / (10 ** 9))
      // rewardPerDay: (res["_rewardPerSecond"]*23*60*60/(10**18))
    , daysLeft: (res["_secondsLeft"]/60/60/24)
     // , daysLeft: (res["_secondsLeft"] / 60 / 60 / 23)


    
      , deposited: web3.utils.fromWei(res["_deposited"] , "gwei")
      , pending: web3.utils.fromWei(res["_pending"], "gwei")
      , depositTokenBalance: web3.utils.fromWei(depBalance , "gwei")

      , rewardTokenBalance: web3.utils.fromWei(rewardBalance, "gwei")
      , depSymbol: depSymbol
      , rewSymbol: rewSymbol
    }

    setUserDetails(parsed);
    setIsGlobalLoading(false);
  }

  function onInputNumberChange(e, f) {
    const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
    if (e.target.value === '' || re.test(e.target.value)) {
      f(e.target.value);
    }
  }

  function isNonZeroNumber(_input) {
    return _input !== undefined && _input !== "" && parseFloat(_input) !== 0.0;
  }

 

  const MainView = () => (
    <>
         <div className="menuwrap">

      <div className="menu"><a href="/home"><img className="logotokens" src="logo.jpg"/> X <img className="logotokens" src="logo.jpg"/> <p> STAKE TOSA EARN TOSA </p></a></div>
      <div className="menu"><a href="/tosatsuyu"><span></span><img className="logotokens" src="logo.jpg"/> X <img className="logotokens" src="tsuyu.png"/> <p> STAKE TOSA EARN TSU </p><span class="new">NEW</span></a></div>
     <div className="menu"><a href="/tsuyutosa"><img className="logotokens" src="tsuyu.png"/>X <img className="logotokens" src="logo.jpg"/>  <p> STAKE TSU EARN TOSA</p><span class="new">NEW</span></a></div>
     
      </div> 
      <br />
 
      <div className="Holepage">
    
        <UserPanel />
   
    
        {(accounts && accounts[0].toLowerCase() === owner.toLowerCase()) ? <AdminPanel /> : undefined}
      </div>
    </>
  );

  const MainViewOrConnectView = () => (
    <>
      {web3 ? <MainView /> : <div className="opensite"><br /><Button className="cbutton" onClick={initConnection} disabled={isConnectingToWallet} >Connect</Button> 
      <p>Connect Your Metamask Wallet</p>
      <img src="bak.png"/></div>}
     
    
    </>
  )

  const LoadingView = () => (
    <>
      <br />
      Loading...
      <br /><br />
      <Spinner animation="border" variant="light" />

    </>
  )

 
   
  return (
    <div className="outerApp">


        
      <BlockchainContext.Provider value={{ web3, accounts, stakerContract, rewardTokenContract, depositTokenContract }}>
        <DisplayContext.Provider value={{ userDetails, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast }}>
          <NavBar />
           
          <div className="App">
  
            {isGlobalLoading ? <LoadingView /> : <MainViewOrConnectView />}



          </div>
          <div className="footer">
          <div className="logofoot">
                <img src="logo.jpg"  height="60px"  className="d-inline-block  "
                />
                <span className="logonamefoot">TOSA INU</span>
                </div>
                <p>We assumes no responsibility with regard to the selection   </p> 
                <p>, performance, security, accuracy, 
              or losses from engaging with any listed projects.</p>
              <div className="logofootsocial">
              <a href="https://discord.gg/mu5k765X"><img src="twitter.png"  height="30px"  className="d-inline-block  "
                /></a>

<a href="https://twitter.com/TosaInu_Erc20"> <img src="discord.png"  height="30px"  className="d-inline-block  "
                /></a>
            </div>
          </div>
        </DisplayContext.Provider>
      </BlockchainContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        transition={Slide}
      />
    </div>

  )
}

export default App;
