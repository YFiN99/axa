'use client';

import React from 'react';
import { useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { injected } from '@wagmi/connectors';
import { Hooks } from 'tempo.ts/wagmi'; // ← Ini dari SDK Tempo

// Token testnet
const ALPHA_USD = '0x20c0000000000000000000000000000000000001';
const BETA_USD = '0x20c0000000000000000000000000000000000002';
const THETA_USD = '0x20c0000000000000000000000000000000000003';

const DECIMALS = 6;
const TEMPO_TESTNET_ID = 42429;

export default function SwapStable() {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const [amountOut, setAmountOut] = useState<string>(''); // amount yang mau didapat (exact out)
  const [tokenIn, setTokenIn] = useState(ALPHA_USD); // pilih tokenIn
  const [tokenOut, setTokenOut] = useState(BETA_USD); // pilih tokenOut

  // Get quote: berapa tokenIn yang dibutuhkan untuk dapat amountOut tokenOut
  const { data: quote } = Hooks.dex.useBuyQuote({
    tokenIn,
    tokenOut,
    amountOut: amountOut ? parseUnits(amountOut, DECIMALS) : 0n,
  });

  // Slippage 0.5%
  const maxAmountIn = quote ? (quote * 1005n) / 1000n : 0n;

  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleConnect = () => connect({ connector: injected() });
  const handleSwitch = () => switchChain({ chainId: TEMPO_TESTNET_ID });

  // Approve tokenIn ke DEX (wajib dulu)
  const handleApprove = () => {
    writeContract({
      address: tokenIn as `0x${string}`,
      abi: [{ name: 'approve', type: 'function', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' }],
      functionName: 'approve',
      args: ['0xdec0000000000000000000000000000000000000', maxAmountIn],
    });
  };

  // Execute buy (dapat exact amountOut)
  const handleSwap = () => {
    if (!maxAmountIn) return;

    // Gunakan Actions dari tempo.ts kalau mau batch approve + swap
    // Tapi simple dulu manual setelah approve
    // Untuk full, cek docs untuk useBuySync atau similar
    alert('Swap manual setelah approve – cek docs untuk full batch');
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Tempo Stablecoin Swap (Alpha/Beta/Theta)</h2>

      {!isConnected ? (
        <>
          <p className="mb-4 text-red-600 text-center">Wallet belum connect!</p>
          <button onClick={handleConnect} className="w-full py-3 bg-blue-600 text-white rounded-lg">Connect MetaMask</button>
        </>
      ) : chainId !== TEMPO_TESTNET_ID ? (
        <>
          <p className="mb-4 text-orange-600 text-center">Salah network!</p>
          <button onClick={handleSwitch} className="w-full py-3 bg-orange-600 text-white rounded-lg">Switch ke Tempo Testnet</button>
        </>
      ) : (
        <>
          <p className="mb-4 text-green-600 text-center">Connected: {address?.slice(0,6)}...{address?.slice(-4)}</p>

          <select onChange={(e) => setTokenIn(e.target.value)} className="w-full mb-4 p-2 border rounded">
            <option value={ALPHA_USD}>AlphaUSD (In)</option>
            <option value={BETA_USD}>BetaUSD (In)</option>
            <option value={THETA_USD}>ThetaUSD (In)</option>
          </select>

          <select onChange={(e) => setTokenOut(e.target.value)} className="w-full mb-4 p-2 border rounded">
            <option value={BETA_USD}>BetaUSD (Out)</option>
            <option value={ALPHA_USD}>AlphaUSD (Out)</option>
            <option value={THETA_USD}>ThetaUSD (Out)</option>
          </select>

          <input
            type="number"
            value={amountOut}
            onChange={(e) => setAmountOut(e.target.value)}
            placeholder="Amount yang mau didapat (e.g. 10)"
            className="w-full mb-4 px-4 py-2 border rounded"
          />

          {quote && (
            <p className="mb-4">Quote: Butuh {formatUnits(quote, DECIMALS)} tokenIn<br />
            Max (0.5% slippage): {formatUnits(maxAmountIn, DECIMALS)}</p>
          )}

          <button onClick={handleApprove} disabled={isWriting || !maxAmountIn} className="w-full mb-2 py-3 bg-yellow-600 text-white rounded-lg">
            Approve TokenIn
          </button>

          <button onClick={handleSwap} disabled={!maxAmountIn} className="w-full py-3 bg-green-600 text-white rounded-lg">
            Swap (setelah approve)
          </button>

          <button onClick={() => disconnect()} className="w-full mt-4 py-3 bg-red-600 text-white rounded-lg">
            Disconnect
          </button>

          {isSuccess && <p className="mt-4 text-green-600 text-center font-bold">Swap berhasil! 🎉</p>}
          {hash && <p className="mt-4 text-center text-sm">Tx: <a href={`https://scout.tempo.xyz/tx/${hash}`} target="_blank" className="text-blue-500 underline">Lihat</a></p>}
        </>
      )}
    </div>
  );
}