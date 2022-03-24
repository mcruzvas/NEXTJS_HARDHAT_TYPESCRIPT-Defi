import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import { ethers } from 'ethers';
import {tokenAddress, token2Address, tokenABI, factoryAddress, factoryABI, erc20ABI} from "./../contracts_abi"
import {ConnectWallet} from "./../../components/ConnectWallet";

declare let window: any

export default class Home extends React.Component {
  state = {
    tokens: ["BTC", "LINK"],
    balance: [],
    prices: [],
    network: {
      avalancheFuji: {
          chainId: `0x${Number(43113).toString(16)}`,
          chainName: "Avalanche Fuji Testnet",
          nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18
          },
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://testnet.snowtrace.io/"]
      }
    }
  }

  componentDidMount = () => {
    this.balanceToken()
    this.priceToken()
  }

  handleNetworkSwitch = async () => {
    try {
        if (!window.ethereum) throw new Error("No crypto wallet found");
        let txn = await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [this.state.network["avalancheFuji"]]
        });
        await txn.wait();
      } catch (err) {
        console.log(err)
      }
  };

  balanceToken = async () =>{
    const { ethereum } = window;
      if (ethereum) {
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const accounts = await provider.listAccounts();

        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        tokenContract.balanceOf(accounts[0]).then((balance:any) =>{
          console.log(ethers.utils.formatEther(balance))
          this.setState({balance:ethers.utils.formatEther(balance)})
        })
      }else{
        console.log("Ethereum object does not exist");
      }
  }
  mintToken = async (item:any) =>{
    const { ethereum } = window;
      if (ethereum) {
        
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        let tokenContract;

        if(item === "BTC"){
          tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        }
        else{
          tokenContract = new ethers.Contract(token2Address, tokenABI, signer);
        }

        tokenContract.saveThatMoney().then((balance: Promise<String>) =>{
          return(balance.toString())
        })
      }else{
        console.log("Ethereum object does not exist");
      }
  }
  priceToken = async () =>{
    const { ethereum } = window;
    if (ethereum) {
      
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      let prices:any = []

      const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
      await factoryContract.getLatestPrice(tokenAddress).then((price:any ) =>{
        console.log("Price: "+ethers.utils.formatEther(price).slice(0,6))
        this.setState({prices:[ethers.utils.formatEther(price).slice(0,6)]})
      })
      
    }else{
      console.log("Ethereum object does not exist");
    }
  }
  render(): React.ReactNode {
    return (
      <div className={styles.container}>

        <Head>
          <title>Loan & Options DApp</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main className={styles.main}>
          <ConnectWallet></ConnectWallet>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Dopex!</a>
          </h1>

          <div className={styles.pricesContainer} >
            {this.state.tokens.map((item,i) => {
              return(
                <div key={i} className={styles.prices} onClick={(item) => {this.mintToken(item)}}>
                  {item} <a className={styles.pricesInside}>{this.state.prices[i]}Ξ</a>
                </div>)
            })}
          </div>
          <div className={styles.balance}>
            <p>Balance: {this.state.balance}</p>
          </div>
          <div className={styles.changeNetwork}>
            <button onClick={this.handleNetworkSwitch} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> Avalanche </button>
          </div>
  
          <p className={styles.description}>
            Get started by editing{' '}
            <code className={styles.code}>pages/index.tsx</code>
          </p>
  
          <div className={styles.grid}>
  
            <a href="https://nextjs.org/learn" className={styles.card}>
              <h2>Learn &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>
  
            <a
              href="https://github.com/vercel/next.js/tree/canary/examples"
              className={styles.card}
            >
              <h2>Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>
  
            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
            >
              <h2>Deploy &rarr;</h2>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </main>
        
        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    )
  }
  
}
