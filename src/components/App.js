import React from "react";
import Web3 from "web3";
import Tether from "./../truffle_abis/Tether.json";
import RWD from "./../truffle_abis/RWD.json";
import DecentralBank from "./../truffle_abis/DecentralBank.json";
const App = () => {
  const [objectInformation, setObjectInformation] = React.useState({
    tether: {},
    rwd: {},
    decentralBank: {},
    tetherBalance: "0",
    rwdBalance: "0",
    stakingBalance: "0",
    accountList: "0x0",
    loading: true,
  });
  const [objectTime, setObjectTime] = React.useState({
    time: {},
    seconds: 20,
  });
  let timer = 0;
  const handleSecondsToTime = (secs) => {
    let hours, seconds, minutes;
    hours = Math.floor(secs / (60 * 60));
    let devisor_for_minutes = secs % (60 * 60);
    minutes = Math.floor(devisor_for_minutes / 60);
    let devisor_for_seconds = devisor_for_minutes % 60;
    seconds = Math.ceil(devisor_for_seconds);
    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  };
  const handleCheckWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      await loadTetherContract();
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
    const rwdData = RWD.networks[networkID];
    const decentralBankData = DecentralBank.networks[networkID];
    // metamask ở GANACHE thì mới lấy được networkID
    if (tetherData && rwdData && decentralBankData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      let tetherBalance = await tether.methods.balanceOf(accountList[0]).call();
      let rwdBalance = await rwd.methods.balanceOf(accountList[0]).call();
      let stakingBalance = await decentralBank.methods
        .stakingBalance(accountList[0])
        .call();
      setObjectInformation({
        ...objectInformation,
        tether,
        rwd,
        decentralBank,
        stakingBalance: web3.utils.fromWei(stakingBalance.toString(), "Ether"),
        rwdBalance: web3.utils.fromWei(rwdBalance.toString(), "Ether"),
        tetherBalance: web3.utils.fromWei(tetherBalance.toString(), "Ether"),
        accountList,
        loading: false,
      });
    } else {
      window.alert(
        "Error! Tether contract not deployed - no detected network!"
      );
    }
  };
  const handleUnstakingFunction = () => {
    const { decentralBankData, accountList: from } = objectInformation;
    setObjectInformation({
      ...objectInformation,
      loading: true,
    });
    decentralBankData.methods
      .unstakeTokens()
      .send({
        from,
      })
      .on("transactionHash", (hash) => {
        setObjectInformation({
          ...objectInformation,
          loading: false,
        });
      });
  };
  const handleStakeTokens = (amount) => {
    const { decentralBankData, accountList: from, tether } = objectInformation;
    setObjectInformation({
      ...objectInformation,
      loading: true,
    });
    tether.methods
      .approve(decentralBankData._address, amount)
      .send({
        from,
      })
      .on("transactionHash", (hash) => {
        decentralBankData.methods
          .depositTokens(amount)
          .send({
            from,
          })
          .on("transactionHash", (hash) => {
            setObjectInformation({
              ...objectInformation,
              loading: false,
            });
          });
      });
  };
  const handleTime = () => {
    let time = handleSecondsToTime(objectTime.seconds);
    setObjectTime({ ...objectTime, time });
  };
  const handleCountDown = () => {
    // 1. countdown one second at a time
    let seconds = objectTime.seconds - 1;
    setObjectTime({
      ...objectTime,
      time: handleSecondsToTime(seconds),
      seconds,
    });
    // 2. stop counting when we hit zero
    if (seconds === 0) {
      clearInterval(timer);
    }
  };
  const handleStartTimer = () => {
    if (timer === 0 && objectTime.seconds > 0) {
      timer = setInterval(handleCountDown, 1000);
    }
  };
  const handleAirdropReleaseTokens = () => {
    let stakingB = objectInformation.stakingBalance;
    if (stakingB >= "500000000000000000") {
      handleStartTimer();
    }
  };
  React.useEffect(() => {
    handleCheckWeb3();
    handleTime();
  }, []);
  console.log(objectInformation);
  return objectInformation.loading ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <p>
        Address <strong>{objectInformation.accountList}</strong>
      </p>
      <p>
        Staking Balance: <strong>{objectInformation.stakingBalance}</strong>
      </p>
      <p>
        RWD Balance: <strong>{objectInformation.rwdBalance}</strong>
      </p>
      <p>
        Balance: <strong>{objectInformation.tetherBalance}</strong>
      </p>
      <button onClick={handleUnstakingFunction}>WithDraw</button>
      <p>{`${objectTime.time.m}:${objectTime.time.s} ${handleStartTimer()}`}</p>
    </>
  );
};
export default App;
