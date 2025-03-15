import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useSignMessage,
  useSendTransaction,
  useSwitchChain,
  useWriteContract,
  useReadContract,
} from 'wagmi';
import { parseAbi } from 'viem';
import WalletModal from './components/WalletModal';
import "./App.css"


function App() {
  const [result, setResult] = useState()
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { signMessage } = useSignMessage({ message: 'Hello, Web3!' });
  const { sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  const parsedAbi = parseAbi([
    'function balanceOf(address owner) view returns (uint256)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
  ])

  const { data: contractReadData } = useReadContract({
      address: "0xb1B83B96402978F212af2415b1BffAad0D2aF1bb",
      abi: parsedAbi,
      functionName: 'balanceOf',
      args: [address],
      query: {
        enabled: isConnected,
      },
    });
  const { writeContract, isPending: isWriting, isSuccess: isWriteSuccess } = useWriteContract({
    address: '0xb1B83B96402978F212af2415b1BffAad0D2aF1bb',
    abi: parseAbi([
      'function transfer(address to, uint amount) returns (bool)',
      'function transferFrom(address from, address to, uint amount) returns (bool)',
    ]),
    functionName: 'transfer',
    args: ["0x0F4A3d0e66fD5967f789F177D237EC60148eB369", BigInt('100000000000000000000')],
      query: {
        enabled: isConnected,
      },
  });
  

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleSendTransaction = async () => {
    await sendTransaction({
      to: '0x0F4A3d0e66fD5967f789F177D237EC60148eB369',
      value: BigInt('1000000000000000'),
    });
  };

  const handleSwitchChain = async () => {
    await switchChain({ chainId: 11155111 }); 
  };

  const formatBalance = () => {
    if (!contractReadData) return '0';
    setResult((Number(contractReadData) / Math.pow(10, 18)).toFixed(4))
    return (Number(contractReadData) / Math.pow(10, 18)).toFixed(4);
  };

  const handleExecute = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      writeContract()
      setResult("Transfer sent successfully")
    } catch (error) {
      console.error('Error executing contract function:', error);
      setResult('Error executing function. Check the console for details.');
    }
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <h1 className="app-title">Web3 Frontend with Wagmi</h1>

      {isConnected ? (
        <div className="connected-content">
          <div className="info-section">
              <p className="info-label">Connected Wallet:</p>
              <p className="info-value">{address}</p>
          </div>

          <div className="info-section">
              <p className="info-label">Balance:</p>
              <p className="info-value">{balance?.formatted} {balance?.symbol}</p>
          </div>

          <div className="info-section">
            <p className="info-label">Chain:</p>
            <p className="info-value">{chain?.name}</p>
          </div>

          <div className="button-grid">
              <button
                onClick={() => signMessage()}
                className="connect-button"
              >
                Sign Message
              </button>

          <button
            onClick={handleSendTransaction}
            className="connect-button"
          >
            Send Transaction
          </button>

          <button
            onClick={handleSwitchChain}
            className="connect-button"
          >
            Switch to Sepolia
          </button>

          <button
            onClick={() => formatBalance()}
            className="connect-button"
          >
            Read Balance From Contract
          </button>
          

          {/* <button
          onClick={() => writeContract()}
          disabled={isReading || isWriting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isReading || isWriting ? 'Processing...' : 'Execute'}
        </button>

      {isWriteSuccess && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="font-semibold">Transaction sent successfully!</p>
        </div>
      )} */}

          <button
            onClick={() => disconnect()}
            className="action-button red"
          >
            Disconnect
          </button>
        </div>
        </div>
      ) : (
        <button
          onClick={() => setIsWalletModalOpen(true)}
          className="connect-button"
        >
          Connect Wallet
        </button>
      )}

      </div>
      
        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          connectors={connectors}
          connect={connect}
        />

      {result && <p><strong>{result}</strong></p>}

      {connectError && <p className="error-message">{connectError.message}</p>}
    </div>
  );
}

export default App;
