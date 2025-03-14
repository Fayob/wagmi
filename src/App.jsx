import { useAccount } from 'wagmi'
import Account from './component/Account'
import { WalletOptions } from './component/WalletOption'

const ConnectWallet = () => {
  const {isConnected} = useAccount();
  if(isConnected) return <Account />
  return <WalletOptions />
}

function App() {
  return (
    <>
      <ConnectWallet />
    </>
  )
}

export default App;