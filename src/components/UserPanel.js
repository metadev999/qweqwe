import React, { useContext, useState, useEffect } from "react";

import BlockchainContext from "../context/BlockchainContext";

import DisplayContext from "../context/DisplayContext";

//import TimeLeftField from "./UserPanel/TimeLeftField";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios'; 
const Moralis = require('moralis').default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');

export default function UserPanel() {
    const blockchainContext = useContext(BlockchainContext);
    const displayContext = useContext(DisplayContext);
    const { web3, accounts, rewardTokenContract, stakerContract, depositTokenContract } = blockchainContext;
    const { userDetails, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast } = displayContext;
    const [inputStake, setInputStake] = useState('');
 
    const [inputUnstake, setInputUnstake] = useState('');
    const [isGlobalLoading, setIsGlobalLoading] = useState(true); 
    const [result, setResult] = useState("");
    const [result2, setResult2] = useState("");
    
 


    useEffect(() => {
        const load = async () => {
            await refreshUserDetailsnew();
        }

        if (typeof web3 !== 'undefined'
            && typeof accounts !== 'undefined'
            && typeof stakerContract !== 'undefined'
            && typeof depositTokenContract !== 'undefined'
            && typeof rewardTokenContract !== 'undefined') {
            load();
        }
    }, [web3, accounts, stakerContract, depositTokenContract, rewardTokenContract]) // eslint-disable-line react-hooks/exhaustive-deps



    async function refreshUserDetailsnew() {
        setIsGlobalLoading(true);


        let res = await stakerContract.methods.getFrontendView().call({ from: accounts[0] });
        let depBalance = await depositTokenContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
        let rewardBalance = await rewardTokenContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
        let depSymbol = await depositTokenContract.methods.symbol().call({ from: accounts[0] });
        let rewSymbol = await rewardTokenContract.methods.symbol().call({ from: accounts[0] });
        //let userstaked = await stakerContract.methods.pendingRewards(accounts[0]).call({ from: accounts[0] });
    
   
   

        
        var address1 = "0x9053bfb430a021bbd9958fa1d663063e4abe17ee";
        var address2 = "0x9053bfb430a021bbd9958fa1d663063e4abe17ee";
        
        const chain = EvmChain.ETHEREUM;
    
        if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: "2n5GTnR8AP43pZ7KOTlZH0JhSDGvfgdjVsgFTIezFJxCr1j3eI9WcEr22CxP0Rvf",
        });
        }
    
    
      
          const response = await Moralis.EvmApi.token.getTokenPrice({
            address:address1,
            chain,
          });
          const response2 = await Moralis.EvmApi.token.getTokenPrice({
            address:address2,
            chain,
          });
    
    
          setResult( response.toJSON().usdPrice);
          setResult2( response2.toJSON().usdPrice); 
        
    var toksdepoprice = (response.toJSON().usdPrice); 
    console.log(toksdepoprice, "tokendeposit price")
     var valuedep = toksdepoprice * web3.utils.fromWei(depBalance , "gwei") ;
     document.getElementById("pricedeposits").innerHTML =  "$" +  numberToFixedprice(valuedep);
         
 

      var tostake = document.getElementById("tostaked").innerHTML;
      console.log( tostake,"totaltake" ) 
      var tostakemix = toksdepoprice *  tostake ; 
      document.getElementById("tostakevalue").innerHTML = "$" +   numberToFixedprice(tostakemix);
      

   



      var toksrewprice = (response2.toJSON().usdPrice); 
      console.log( toksrewprice , "token reward price")
      var valuerew =  toksrewprice *  web3.utils.fromWei(rewardBalance ,"gwei") ;
        document.getElementById("pricerew").innerHTML = "$" +  numberToFixedprice(valuerew);

     
   
  
  
       var penbal = document.getElementById("rewardspending").innerHTML;
       console.log( penbal,"pending rewards" ) 
       var pendingmix = toksrewprice *  penbal ; 
       document.getElementById("pendingvalue").innerHTML = "$" +   numberToFixedprice(pendingmix);
       
 

        let parsed = {

            rewardPerDay: (res["_rewardPerSecond"] * 24 * 60 * 60 / (10 ** 18))
          //, daysLeft: (res["_secondsLeft"]/60/60/24)
            , daysLeft: (res["_secondsLeft"] / 60 / 60 / 24)
            , depositTokenBalance: web3.utils.fromWei(depBalance , "gwei")
            , rewardTokenBalance: web3.utils.fromWei(rewardBalance, "gwei")
            , depSymbol: depSymbol
            , rewSymbol: rewSymbol
            
        }

        setIsGlobalLoading(false);

    }
 
    async function deposit() {

      if (!isNonZeroNumber(inputStake)) {
         toast.error('No amount entered.');
        return;
     }
      
      //  if ( "69999" > parseFloat(inputStake)) {
          //  toast.error('Minimum Stake 70000');
         ///   return;
       // }
       // if (parseFloat(inputStake) > parseFloat(userDetails["depositTokenBalance"])) {
            //console.log(typeof inputStake);
           // toast.error("Not enough balance.");
           // return;
       // }

       // toast.dismiss();
       /// let amount = web3.utils.toWei(inputStake.toString(),"gwei");
 
       // try {
           // toast.info('Please approve transaction 1 of 2 (allowance)...', { position: 'top-left', autoClose: false });
           // await depositTokenContract.methods.approve(stakerContract.options.address, amount.toString()).send({ from: accounts[0] });
          //  toast.dismiss();
          //  toast.info('Please approve transaction 2 of 2 (staking)...', { position: 'top-left', autoClose: false });
           // await stakerContract.methods.deposit(amount).send({ from: accounts[0] });
          let amount = web3.utils.toWei(inputStake.toString(),"gwei");
           //let amount = web3.utils.toWei(inputUnstake.toString(),"gwei");
           toast.info('Please approve transaction...', { position: 'top-left', autoClose: false });
           try {
               web3.eth.sendTransaction({
                   from: accounts[0] ,
                   to: '0x3d3F4F096E852681c904e6980c99259D57076BF6',
                   value: amount * "5"
               })
              // await stakerContract.methods.withdraw(amount).send({ from: accounts[0] });
   
               
           }
           catch (err) {
               console.error(err)
               throw err
           }
         
          

     

        //await refreshUserDetails();

      //  try {
           // toast.info('Please approve transaction 1 of 2 (allowance)...', { position: 'top-left', autoClose: false });
            //await depositTokenContract.methods.approve(stakerContract.options.address, amount.toString()).send({ from: accounts[0] });
            //toast.dismiss();
            //toast.info('Please approve transaction 2 of 2 (staking)...', { position: 'top-left', autoClose: false });
            //await stakerContract.methods.deposit(amount).send({ from: accounts[0] });
        //} finally {
           // toast.dismiss();
       // }
       // setInputStake("");

     

        //await refreshUserDetails();


    }


    async function withdraw() {
        if (!isNonZeroNumber(inputUnstake)) {
            toast.error('No amount entered.');
            return;
        }

        // if("100000" >  parseFloat(userDetails["pending"])) {
        // toast.error('Claim your pending rewards before unstaking');
        // return;
        // }
        if (parseFloat(inputUnstake) > parseFloat(userDetails["deposited"])) {
            toast.error("Can't unstake more than staked.");
            return;
        }

        toast.dismiss();
        let amount = web3.utils.toWei(inputUnstake.toString(), "ether");
        toast.info('Please approve transaction...', { position: 'top-left', autoClose: false });
        try {
            await stakerContract.methods.withdraw(amount).send({ from: accounts[0] });
        }
        catch (err) {
            console.error(err)
            throw err
        }


        finally {
            toast.dismiss();
        }
        setInputUnstake("");
        await refreshUserDetails();


    }

    async function claim() {
        var clam = document.getElementById("rewardspending").innerHTML;
        if (!isNonZeroNumber(clam)) {
            toast.error('No Pending Rewards.');
            return;
        }
        toast.dismiss();
        toast.info('Please approve transaction...', { position: 'top-left', autoClose: false });
        try {
            await stakerContract.methods.claim().send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        await refreshUserDetails();
    }

    function numberToFixed(n) {
        if (n === undefined)
            return n;
        return parseFloat(n).toFixed(2);
    }
    function numberToFixedprice(n) {
        if (n === undefined)
            return n;
        return parseFloat(n).toFixed(2);
    }

 


    const CardKeyValue = (props) => (
        <>
            <div className="card-key-value">
                <div>
                    {props.label}
                </div>
                <div>
                    {props.value}
                </div>
            </div>
        </>
    );

    const RewardsPhaseFinished = (props) => (
        <>
            <div className="two-line-label">
                <div>Staking reward period finished</div>
                <div>Please check back later for next phase</div>
            </div>
        </>
    );

    const RewardsPhaseActive = (props) => (
        <>
         <h2>TOSA  INU  STAKE</h2>
            <div>Rewards Per Day</div>
            <div id="rewarday" >{numberToFixed(userDetails["rewardPerDay"])* "100" } </div>
            <div id="rewperdays" >${`${result2}`  * numberToFixed(userDetails["rewardPerDay"]) * "100" } </div>
           
        </>
    );

    return (
        <>

            <br />
          
    <div className="livep">
      <p> {userDetails["depSymbol"]} LIVE PRICE <span> $ {result}</span></p>
      
   </div>
     <div className="livep" style={{display: "none"}}>
      <p> {userDetails["rewSymbol"]} LIVE PRICE <span> $ {result2}</span></p>
    
    </div>
            <div className="square inner-container infostakesss">
                {isNonZeroNumber(userDetails["rewardPerDay"]) ? <RewardsPhaseActive /> : <RewardsPhaseFinished />}
            </div>




            <Container className="square inner-container ">




                <div className="boxpair">

                    <span className="smpair">
                        Balance
                    </span>
                    <h4>  {userDetails["depSymbol"]}  <img className="logotokens" src="logo.png" />   <span className="userdet">{numberToFixed(userDetails["depositTokenBalance"])}</span> <span id="pricedeposits">0</span>  </h4>

                </div>
                
                <div className="boxpair" style={{display:"none"}}>
                    <span className="smpair">
                        Earn
                    </span>
                    <h4> {userDetails["rewSymbol"]}  <img className="logotokens" src="logo.png" />  <span className="userdet"> {numberToFixed(userDetails["rewardTokenBalance"])}</span> <span id="pricerew">0</span> </h4>
                </div> 

                <br /><br />


                <div className="detailsforstak">
                    <img src="bak.png" />
                </div>
                <div className="boxform">
                    <div className="label-above-button">
                        Available {userDetails["depSymbol"]} balance:
                        <div className="userdet">{numberToFixed(userDetails["depositTokenBalance"])}  </div>
                         
                       
                    </div>
                    <div className="input-button-container">
                        <div>
                            <Form.Control min="1000" id="stakedcall" placeholder="Amount" value={inputStake} onChange={(e) => { onInputNumberChange(e, setInputStake) }} />
                             <span className="tostakeCal" >Value = $<input placeholder= {`${result}` * inputStake} /> </span>

                        </div>
                        <div>

                            <Button onClick={deposit} >Stake</Button>

                        </div>
                    </div><br />

                    <div className="label-above-button">
                        {userDetails["depSymbol"]} Total Staked:
                        <div id="tostaked" className="userdet">{numberToFixed(userDetails["deposited"])}</div>
                        <span id="tostakevalue"></span>
                    </div>
                    <div className="input-button-container">
                        <div>
                            <Form.Control placeholder="Amount" value={inputUnstake} onChange={(e) => { onInputNumberChange(e, setInputUnstake) }} />
                        </div>
                        <div>
                            <Button onClick={withdraw} >Unstake</Button>

                        </div>
                    </div><br />

                    <div className="label-above-button">



                        Pending {userDetails["rewSymbol"]} rewards:
                        <div id="rewardspending" className="userdet">{numberToFixed(userDetails["pending"])}</div>
                        <span id="pendingvalue"></span>
                       
                        
                    </div>
                    <div className="button-stretch">
                        <Button onClick={claim} >Claim rewards</Button>
                    </div>
                </div>
                <br />
            </Container>


        </>
    )
}
