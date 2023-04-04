import React, {useContext, useState} from "react";

import BlockchainContext from "../context/BlockchainContext";
import DisplayContext from "../context/DisplayContext";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import TimeLeftField from "./UserPanel/TimeLeftField";
 

export default function AdminPanel() {
    const blockchainContext = useContext(BlockchainContext);
    const displayContext = useContext(DisplayContext);
    const { web3, accounts, stakerContract, rewardTokenContract } = blockchainContext;
    const {userDetails, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast} = displayContext;
    const [result2, setResult2] = useState("");
    const [inputAdminRewards, setInputAdminRewards] = useState('');
    const [inputAdminDuration, setInputAdminDuration] = useState('');
    const Moralis = require('moralis').default;
    const { EvmChain } = require('@moralisweb3/common-evm-utils');

 
    
    (async ()=>{
      
        var address2 = "0x9053bfb430a021bbd9958fa1d663063e4abe17ee";

        const chain = EvmChain.ETHEREUM; 
        if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: "2n5GTnR8AP43pZ7KOTlZH0JhSDGvfgdjVsgFTIezFJxCr1j3eI9WcEr22CxP0Rvf",
        });
        } 
        const response2 = await Moralis.EvmApi.token.getTokenPrice({
            address:address2,
            chain,
        });
    
    
         setResult2( response2.toJSON().usdPrice); 
       
        
        })();


 
    async function addRewards() {
      if (userDetails["daysLeft"] !== 0.) {
         toast.info("Can't add rewards in middle of campaign. Please wait for campaign to finish.");
          return;
       }
        if (!(isNonZeroNumber(inputAdminRewards) && isNonZeroNumber(inputAdminDuration))) {
            toast.info('Please add missing input.');
            return;
        }
        if (parseFloat(inputAdminRewards) > parseFloat(userDetails["rewardTokenBalance"])) {
            toast.error("Not enough balance.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputAdminRewards,"gwei")  ; 
        let days = inputAdminDuration;
        try {
            toast.info('Please approve transaction 1 of 2 (allowance)...', {position: 'top-left', autoClose: false});
            await rewardTokenContract.methods.approve(stakerContract.options.address, amount.toString()).send({ from: accounts[0] });
            toast.dismiss();
            toast.info('Please approve transaction 2 of 2 (add rewards)...', {position: 'top-left', autoClose: false});
            await stakerContract.methods.addRewards(amount.toString(), days).send({ from: accounts[0] });
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

    return (
        <>
            <Container className="square inner-container">
            <br/>
                <h2>Admin Dashboard</h2>
                <br/>
                 Add {userDetails["rewSymbol"]} Rewards
                <hr/>

                <TimeLeftField />


          <div className="boxform">
        
                <div className="label-above-button">
                    Available {userDetails["rewSymbol"]} balance   
                    <div className="userdet">{numberToFixed(userDetails["rewardTokenBalance"])}</div>
                </div>
                <div className="input-button-container">
                    <Form.Control key="a1" placeholder="Amount" value={inputAdminRewards} onChange={(e) => {onInputNumberChange(e, setInputAdminRewards)}}/>
                                        
                </div>   
                <div><span className="tostakeCal" >Value = $<input placeholder= {`${result2}` * inputAdminRewards} /> </span>
 
</div>      
                <br/><hr/>

                <br/>Duration (in days)<br/>
                <div className="input-button-container">
                    <Form.Control placeholder="Days" value={inputAdminDuration} onChange={(e) => {onInputNumberChange(e, setInputAdminDuration)}}/>
                </div>
                <br/><hr/>

                <div className="button-stretch">
                    <br/><Button onClick={addRewards} variant="secondary">Add</Button><br/>
                </div>
          </div>

            <div className="detailsforstak">
                <img src="bak.png"/>
            </div>
                <br/>
            </Container>
        </>
    )
}