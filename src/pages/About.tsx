import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const About = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold">About Onchain Pension Fund</h1>
        <p className="mt-2 text-muted-foreground">
          A decentralized, onchain pension fund administrator built on Octant v2's Yield Donating Vaults.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            This project introduces a decentralized, onchain pension fund administrator built on Octant v2's Yield Donating Vaults. It aims to disrupt and replace traditional pension institutions by providing a trustless, global alternative for retirement savings. Traditional pensions suffer from high fees (1-2%), opacity, centralized control, and limited accessibility—often requiring employers or specific geographies. Our solution leverages DeFi to enable:
            <ul className="list-disc mt-4 ml-4 space-y-1">
              <li><strong>Permissionless Participation:</strong> Anyone can deposit USDC (simulating employee/employer contributions) without KYC or intermediaries.</li>
              <li><strong>Transparent Yield Generation:</strong> Funds are diversified across high-yield protocols (Aave v3 Vaults, Spark, Yearn v3), generating sustainable returns.</li>
              <li><strong>Vesting and Security:</strong> Time-locked withdrawals (minimum 30 days) to mimic pension vesting, preventing impulsive spending.</li>
              <li><strong>Inheritance Mechanisms:</strong> Beneficiaries can claim funds after an inactivity period (365 days), simulating payouts for death or disability.</li>
              <li><strong>Social Impact via Public Goods:</strong> Excess yield is automatically donated to a configurable "Pension DAO" multisig, funding web3 contributor "retirements" (e.g., OSS developers via Gitcoin), creating a self-sustaining ecosystem.</li>
              <li><strong>Cost Efficiency:</strong> DeFi fees (~0.5%) vs. traditional 1-2%; fully auditable onchain.</li>
              <li><strong>Programmability:</strong> Future extensions for recurring deposits (e.g., via Gelato), tax reporting, or multi-asset support.</li>
            </ul>
          </CardDescription>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <ul className="list-disc ml-4 space-y-1">
              <li><strong>Diversified Investment Strategy:</strong> Allocates deposits equally (~33%) to Aave v3 Vault, Spark Lending, and Yearn v3 Vault (deployed via Kalani) for risk-managed yield.</li>
              <li><strong>Pension-Like Mechanics:</strong>
                <ul className="list-disc ml-4 mt-2">
                  <li>Time-locked withdrawals to enforce long-term saving.</li>
                  <li>Beneficiary designation and claim function for secure inheritance.</li>
                </ul>
              </li>
              <li><strong>Automated Donations:</strong> Yield beyond base is donated to public goods, configurable via constructor (e.g., Gitcoin or custom DAO).</li>
              <li><strong>User-Friendly dApp:</strong> Simple frontend for deposits, withdrawals, beneficiary settings, and claims.</li>
              <li><strong>Security:</strong> Inherits Octant's BaseHealthCheck; adds ReentrancyGuard and nonReentrant modifiers.</li>
            </ul>
          </CardDescription>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <ul className="list-disc ml-4 space-y-1">
              <li><strong>Smart Contracts:</strong> Solidity ^0.8.25, Foundry for testing/deployment.</li>
              <li><strong>Base Framework:</strong> Octant v2 (YieldDonatingTokenizedStrategy, BaseHealthCheck).</li>
              <li><strong>Integrations:</strong>
                <ul className="list-disc ml-4 mt-2">
                  <li>Aave v3 ERC-4626 Vault.</li>
                  <li>Spark Lending Pool.</li>
                  <li>Yearn v3 Vault (deployed with Kalani).</li>
                </ul>
              </li>
              <li><strong>Frontend:</strong> Vite (React, wagmi) for wallet interactions.</li>
              <li><strong>Chain:</strong> Ethereum Sepolia testnet (mainnet compatible).</li>
              <li><strong>Dependencies:</strong> OpenZeppelin, Spark, Yearn, Aave libraries.</li>
            </ul>
          </CardDescription>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-center">
        <Link to="/">
          <Button variant="outline" className="mt-6">
            ← Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default About;