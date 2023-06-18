import React from "react";
import Web3 from "web3";
import Tether from "./../truffle_abis/Tether.json";
const App = () => {
  const [objectInformation, setObjectInformation] = React.useState({
    tether: {},
    rwd: {},
    decentralBank: {},
    tetherBalance: "0",
    rwdBalance: "0",
    stakingBalance: "0",
    loading: true,
    accountList: "0x0",
  });
  const handleCheckWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("No ethereum browser detected! You can check out MetaMask!");
    }
  };
  const loadTetherContract = async () => {
    const web3 = window.web3;
    const accountList = await web3.eth.getAccounts();
    const networkID = await web3.eth.net.getId();
    const tetherData = Tether.networks[networkID];
    // metamask ở GANACHE thì mới lấy được networkID
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      let tetherBalance = await tether.methods.balanceOf(accountList[0]).call();
      console.log(tetherBalance);
      setObjectInformation({
        ...objectInformation,
        tether,
        tetherBalance: tetherBalance.toString(),
        accountList,
      });
    } else {
      window.alert(
        "Error! Tether contract not deployed - no detected network!"
      );
    }
  };
  const handleLoad = async () => {
    await handleCheckWeb3();
    await loadTetherContract();
  };
  React.useEffect(() => {
    handleLoad();
  }, []);
  return (
    <>
      <p>
        Address <strong>{objectInformation.accountList}</strong>
      </p>
    </>
  );
};
export default App;
