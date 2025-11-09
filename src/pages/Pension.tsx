'use client';

import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { BaseError } from 'wagmi';
import { formatUnits, parseUnits, isAddress } from 'viem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import PensionABI from '@/abis/PensionStrategy.json';
import SDAI_ABI from '@/abis/sDAI.json'; // sDAI ABI for yield read
import SUSDS_ABI from '@/abis/sUSDS.json'; // sUSDS ABI for yield read
import USDC_ABI from '@/abis/USDC.json'; // For DAI 

const STRATEGY_ADDRESS = '0xYOUR_DEPLOYED_STRATEGY_HERE' as `0x${string}`;
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`; // DAI mainnet (underlying for sDAI)
const SDAI_ADDRESS = '0x83F20F44975D03b1b09E64809B757c47f942BEeA' as `0x${string}`; // sDAI
const SUSDS_ADDRESS = '0xa3931d71877C0e7A3148CB7Eb4463524FEc27fbD' as `0x${string}`; // sUSDS

export default function PensionPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [newBeneficiary, setNewBeneficiary] = useState('');
  const [claimOwner, setClaimOwner] = useState('');
  // ---------- Reads ----------
  const { data: shares, isLoading: isDataLoading } = useReadContract({
    address: STRATEGY_ADDRESS,
    abi: PensionABI,
    functionName: 'balanceOf',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });
  const { data: depositTimestamp } = useReadContract({
    address: STRATEGY_ADDRESS,
    abi: PensionABI,
    functionName: 'depositTimestamps',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });
  const { data: beneficiary } = useReadContract({
    address: STRATEGY_ADDRESS,
    abi: PensionABI,
    functionName: 'beneficiaries',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });
  const { data: totalDeposited } = useReadContract({
    address: STRATEGY_ADDRESS,
    abi: PensionABI,
    functionName: 'totalDeposited',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });
  const { data: claimedMonths } = useReadContract({
    address: STRATEGY_ADDRESS,
    abi: PensionABI,
    functionName: 'claimedMonths',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });
  const { data: daiBalance } = useReadContract({
    address: DAI_ADDRESS,
    abi: USDC_ABI, // Reuse for DAI (same ERC20)
    functionName: 'balanceOf',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });
  const { data: daiAllowance } = useReadContract({
    address: DAI_ADDRESS,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address ? [address, STRATEGY_ADDRESS] : ['0x0000000000000000000000000000000000000000', STRATEGY_ADDRESS],
    query: { enabled: !!address },
  });
  const { data: sDAI_balance } = useReadContract({
    address: STRATEGY_ADDRESS, 
    abi: SDAI_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address },
  });
  const { data: sDAI_assets } = useReadContract({
    address: SDAI_ADDRESS,
    abi: SDAI_ABI,
    functionName: 'convertToAssets',
    args: sDAI_balance ? [sDAI_balance as bigint] : [0n],
    query: { enabled: !!sDAI_balance && (sDAI_balance as bigint) > 0n },
  });
  const { data: sUSDS_balance } = useReadContract({
    address: STRATEGY_ADDRESS,
    abi: SUSDS_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address },
  });
  const { data: sUSDS_assets } = useReadContract({
    address: SUSDS_ADDRESS,
    abi: SUSDS_ABI,
    functionName: 'convertToAssets',
    args: sUSDS_balance ? [sUSDS_balance as bigint] : [0n],
    query: { enabled: !!sUSDS_balance && (sUSDS_balance as bigint) > 0n },
  });
  // ---------- Helpers ----------
  const isValidAmount = (amount: string): boolean => {
    const num = Number(amount);
    return !isNaN(num) && num > 0 && num <= Number(formatUnits(BigInt(daiBalance?.toString() ?? '0'), 18)); // DAI 18 decimals
  };
  const isValidAddress = (addr: string): boolean => isAddress(addr);
  const lockEnd = depositTimestamp ? Number(depositTimestamp) + 30 * 24 * 60 * 60 : 0;
  const now = Date.now() / 1000;
  const isLocked = !!depositTimestamp && now < lockEnd;
  const vestingMonths = 360;
  const monthlyPrincipal = totalDeposited ? Number(formatUnits(BigInt((totalDeposited as any).toString()), 18)) / vestingMonths : 0; // DAI 18 decimals
  const monthsElapsed = depositTimestamp ? Math.floor((now - Number(depositTimestamp)) / (30 * 24 * 60 * 60)) : 0;
  const claimableMonths = monthsElapsed - Number(claimedMonths ?? 0);
  const estimatedMonthly = claimableMonths > 0 ? monthlyPrincipal * claimableMonths : 0;
  const estimatedYield = (sDAI_assets ? Number(formatUnits(BigInt((sDAI_assets as any).toString()), 18)) : 0) + (sUSDS_assets ? Number(formatUnits(BigInt((sUSDS_assets as any).toString()), 18)) : 0);
  // ---------- Actions ----------
  const approveDAI = async () => {
    if (!isConnected) return toast.error('Connect wallet');
    try {
      const hash = await writeContractAsync({
        address: DAI_ADDRESS,
        abi: USDC_ABI, // Reuse for DAI
        functionName: 'approve',
        args: [STRATEGY_ADDRESS, parseUnits('1000000', 18)], // 1M DAI (18 decimals)
      });
      toast.success(`Approved DAI! Tx: ${hash}`);
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Approval failed');
    }
  };
  const deposit = async () => {
    if (!isValidAmount(depositAmount) || !isConnected) return toast.error('Invalid amount or wallet not connected');
    try {
      const hash = await writeContractAsync({
        address: STRATEGY_ADDRESS,
        abi: PensionABI,
        functionName: 'deposit',
        args: [parseUnits(depositAmount, 18), address!], // 18 decimals for DAI
      });
      toast.success(`Deposited DAI to sDAI/sUSDS! Tx: ${hash}`);
      setDepositAmount('');
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Deposit failed');
    }
  };
  const withdraw = async () => {
    if (!isValidAmount(withdrawAmount) || !isConnected || isLocked) return toast.error(isLocked ? 'Vesting locked' : 'Invalid amount or wallet');
    try {
      const hash = await writeContractAsync({
        address: STRATEGY_ADDRESS,
        abi: PensionABI,
        functionName: 'withdraw',
        args: [parseUnits(withdrawAmount, 18), address!, address!], // 18 decimals
      });
      toast.success(`Withdrawn DAI! Tx: ${hash}`);
      setWithdrawAmount('');
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Withdraw failed');
    }
  };
  const setBeneficiary = async () => {
    if (!isValidAddress(newBeneficiary) || !isConnected) return toast.error('Invalid beneficiary address');
    try {
      const hash = await writeContractAsync({
        address: STRATEGY_ADDRESS,
        abi: PensionABI,
        functionName: 'setBeneficiary',
        args: [newBeneficiary as `0x${string}`],
      });
      toast.success(`Beneficiary set! Tx: ${hash}`);
      setNewBeneficiary('');
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Failed to set beneficiary');
    }
  };
  const claimAsBeneficiary = async () => {
    if (!isValidAddress(claimOwner) || !isConnected) return toast.error('Invalid owner address');
    try {
      const hash = await writeContractAsync({
        address: STRATEGY_ADDRESS,
        abi: PensionABI,
        functionName: 'claimAsBeneficiary',
        args: [claimOwner as `0x${string}`],
      });
      toast.success(`Claimed as beneficiary! Tx: ${hash}`);
      setClaimOwner('');
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Claim failed');
    }
  };
  const claimMonthlyPension = async () => {
    if (!isConnected || claimableMonths <= 0) return toast.error(claimableMonths <= 0 ? 'No monthly claimable' : 'Connect wallet');
    try {
      const hash = await writeContractAsync({
        address: STRATEGY_ADDRESS,
        abi: PensionABI,
        functionName: 'claimMonthlyPension',
      });
      toast.success(`Monthly pension claimed (~${estimatedMonthly.toFixed(2)} DAI)! Tx: ${hash}`);
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Monthly claim failed');
    }
  };
  const claimAndOfframp = async () => {
    if (!isConnected || claimableMonths <= 0) return toast.error(claimableMonths <= 0 ? 'No monthly claimable' : 'Connect wallet');
    try {
      const claimHash = await writeContractAsync({
        address: STRATEGY_ADDRESS,
        abi: PensionABI,
        functionName: 'claimMonthlyPension',
      });
      // Load Ramp demo environment
      const script = document.createElement('script');
      script.src = 'https://app.demo.rampnetwork.com/sdk/ramp-instant-sdk.js';
      if (!document.querySelector('script[src="https://app.demo.rampnetwork.com/sdk/ramp-instant-sdk.js"]')) {
        document.body.appendChild(script);
      }
      script.onload = () => {
        const ramp = new (window as any).RampInstantSDK({
          hostAppName: 'Onchain Pension',
          swapAsset: 'DAI', // Updated to DAI
          fiatCurrency: 'USD',
          fiatValue: estimatedMonthly.toFixed(2),
          defaultFlow: 'OFFRAMP',
          userAddress: address,
          finalUrl: window.location.href,
          api: 'https://api.demo.rampnetwork.com/api',
        });
        ramp.show();
      };
      toast.success(`Claimed + Offramp to bank opened! Tx: ${claimHash}`);
    } catch (err) {
      toast.error((err as BaseError).shortMessage || 'Offramp failed');
    }
  };
  const createVirtualBankAccount = async () => {
    if (!isConnected) return toast.error('Connect wallet');
    try {
      // Mock backend call (no real backend – demo mode)
      const dummyData = {
        routing_number: '021000021', // Chase routing
        account_number: `123456789${Math.floor(Math.random() * 1000)}`, // Random account
      };
      toast.success(`Virtual US bank account created (demo mode)!\nRouting: ${dummyData.routing_number}\nAccount: ${dummyData.account_number}\nSaved for Ramp offramps.`);
    } catch (err) {
      toast.error('Bank creation failed – demo mode active');
    }
  };
  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Onchain Pension Fund</CardTitle>
          <CardDescription>Monthly claims + one-click bank offramp + virtual accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2 text-sm">
            {!isConnected ? (
              <p>Connect wallet to see stats</p>
            ) : isDataLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <>
                <p>Your Shares: {shares ? formatUnits(BigInt(shares.toString()), 18) : '0'}</p>
                <p>Total Deposited: {totalDeposited ? formatUnits(BigInt(totalDeposited.toString()), 18) : '0'}</p>
                <p>DAI Balance: {daiBalance ? formatUnits(BigInt(daiBalance.toString()), 18) : '0'}</p>
                <p>DAI Allowance: {daiAllowance ? formatUnits(BigInt(daiAllowance.toString()), 18) : '0'}</p>
                <p>sDAI Yield Estimate: {sDAI_assets ? formatUnits(BigInt(sDAI_assets.toString()), 18) : '0'}</p>
                <p>sUSDS Yield Estimate: {sUSDS_assets ? formatUnits(BigInt(sUSDS_assets.toString()), 18) : '0'}</p>
                <p>Vesting Lock: {isLocked ? `Locked until ~${new Date(lockEnd * 1000).toLocaleString()}` : 'Unlocked ✅'}</p>
                <p>Claimable Months: {claimableMonths}</p>
                <p>Estimated Monthly: ~${estimatedMonthly.toFixed(2)}</p>
                <p>Current Beneficiary: {beneficiary?.toString() || 'None'}</p>
              </>
            )}
          </div>
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="deposit">Deposit DAI</TabsTrigger>
              <TabsTrigger value="claim">Monthly Claim</TabsTrigger>
              <TabsTrigger value="offramp">Offramp to Bank</TabsTrigger>
              <TabsTrigger value="bank">Virtual Bank</TabsTrigger>
              <TabsTrigger value="beneficiary">Beneficiary</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit" className="space-y-4">
              <div>
                <Label>Amount (DAI)</Label>
                <Input
                  placeholder="100.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
              </div>
              {(!daiAllowance || daiAllowance === 0n) && (
                <Button onClick={approveDAI} disabled={isPending}>
                  Approve DAI
                </Button>
              )}
              <Button onClick={deposit} disabled={isPending || !daiAllowance || daiAllowance === 0n || !isValidAmount(depositAmount)}>
                Deposit & Start Vesting (to sDAI/sUSDS)
              </Button>
            </TabsContent>
            <TabsContent value="claim" className="space-y-4">
              <p className="text-sm text-muted-foreground">Claim your monthly vested pension (principal + yield from sDAI/sUSDS)</p>
              <Button onClick={claimMonthlyPension} disabled={isPending || claimableMonths <= 0}>
                Claim Monthly Pension (~${estimatedMonthly.toFixed(2)} DAI)
              </Button>
            </TabsContent>
            <TabsContent value="offramp" className="space-y-4">
              <p className="text-sm text-muted-foreground">One-click: Claim monthly + convert to USD and send to bank</p>
              <Button onClick={claimAndOfframp} disabled={isPending || claimableMonths <= 0}>
                Claim + Offramp to Bank (One-Click Fiat Payout)
              </Button>
            </TabsContent>
            <TabsContent value="bank" className="space-y-4">
              <p className="text-sm text-muted-foreground">Create a virtual US bank account for fiat payouts</p>
              <Button onClick={createVirtualBankAccount} disabled={isPending}>
                Create Virtual US Bank Account (Stripe Treasury)
              </Button>
            </TabsContent>
            <TabsContent value="beneficiary" className="space-y-4">
              <div>
                <Label>New Beneficiary Address</Label>
                <Input
                  placeholder="0x..."
                  value={newBeneficiary}
                  onChange={(e) => setNewBeneficiary(e.target.value)}
                />
              </div>
              <Button onClick={setBeneficiary} disabled={isPending || !isValidAddress(newBeneficiary)}>
                Set Beneficiary
              </Button>
              <div className="pt-4">
                <Label>Claim as Beneficiary (Owner Address)</Label>
                <Input
                  placeholder="0x..."
                  value={claimOwner}
                  onChange={(e) => setClaimOwner(e.target.value)}
                />
                <Button onClick={claimAsBeneficiary} disabled={isPending || !isValidAddress(claimOwner)}>
                  Claim as Beneficiary
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

