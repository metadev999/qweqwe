import React, {useContext} from "react";

import BlockchainContext from "../context/BlockchainContext";


export default function NavBar() {
    const blockchainContext = useContext(BlockchainContext);
    const { web3, accounts } = blockchainContext;

    const AddressView = () => (
        <>
            {accounts? accounts[0].substring(0,6) : undefined}...{accounts? accounts[0].substring(accounts[0].length-4,accounts[0].length) : undefined}
        </>
    )

    return (
        <>
            <div className="minimalistic-nav-bar">
                <div>
                <img
                    alt=""
                    src= "logo.jpg"
                    
                    height="60px"
                    className="d-inline-block  "
                /><span className="logoname">TOSA INU</span>
                </div>
                <div>
               
                </div>
                <div>
                {web3? <AddressView />: 'Not connected'}
                
                </div>
            </div>
        </>
    )
}