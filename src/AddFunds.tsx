import React from "react";
import { Hooks } from "tempo.ts/wagmi";
import { useAccount } from "wagmi";

export default function AddFunds() {
  const { address } = useAccount();
  const { mutate, isPending } = Hooks.faucet.useFundSync();

  return (
    <button onClick={() => address && mutate({ account: address })} disabled={isPending}>
      {isPending ? "Adding Funds..." : "Add Funds"}
    </button>
  );
}
