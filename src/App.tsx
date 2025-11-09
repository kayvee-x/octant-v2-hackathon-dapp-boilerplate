import { BrowserRouter, Routes, Route, Link } from 'react-router';
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Fixed header wallet connect
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, CreditCard, Lock, Shield, User, Wallet } from 'lucide-react';
import About from '@/pages/About';
import Pension from '@/pages/Pension';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* FIXED HEADER – ConnectButton + Address + Navigation (All Pages) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold">
            Onchain Pension Fund
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link to="/pension">
              <Button variant="ghost" size="sm">
                Vault
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="sm">
                About
              </Button>
            </Link>
            <ConnectButton /> 
          </nav>
        </div>
      </header>

      {/* Main Content – Scrollable below header */}
      <main className="pt-16"> {/* Offset for fixed header */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pension" element={<Pension />} />
        </Routes>
      </main>
      <Toaster />
    </BrowserRouter>
  );
}

const Home = () => {
  return (
    <div className="container mx-auto min-h-screen space-y-16 px-4 py-12">
      {/* Hero Section */}
      <header className="space-y-4 text-center">
        <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl">
          Onchain Pension Fund
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl">
          A trustless DeFi vault for retirement savings on Octant v2. Deposit USDC, earn yield from Aave, Yearn, and Spark, with vesting and inheritance.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary">Yield Donating</Badge>
          <Badge variant="secondary">Public Goods</Badge>
          <Badge variant="secondary">Aave v3</Badge>
          <Badge variant="secondary">Kalani</Badge>
          <Badge variant="secondary">Spark</Badge>
        </div>
        <Link to="/pension">
          <Button size="lg" className="mt-6 text-lg">
            <Wallet className="mr-2 h-5 w-5" />
            Get Started – Launch Vault
          </Button>
        </Link>
      </header>

      <Separator />

      {/* Step-by-Step Guide */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">How It Works: Step by Step</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Follow these steps to set up your onchain pension. No KYC, global, and auditable.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Wallet className="h-6 w-6 mr-2" />
                1. Connect Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect MetaMask or WalletConnect. Switch to Ethereum Mainnet. Get test USDC from a faucet if needed (for demo).
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                2. Deposit USDC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Approve and deposit USDC. Funds vest over 30 days (initial lock), then 30 years (360 monthly claims). Yield from Aave, Yearn, Spark.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                3. Set Beneficiary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Designate a beneficiary for inheritance. Claimable after 365 days inactivity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                4. Claim Monthly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                After vesting, claim monthly (principal + 99% yield; 1% fee to management). One-click to bank via Ramp.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                5. Offramp to Bank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Claim + convert to USD, send to virtual bank account (auto-created with Stripe). No KYC for small amounts.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Lock className="h-6 w-6 mr-2" />
                6. Yield Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                99% yield donated to Gitcoin (public goods). Track via Etherscan.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <div className="text-center">
          <Link to="/pension">
            <Button size="lg" className="mt-8">
              Launch Pension Vault
            </Button>
          </Link>
        </div>
      </section>

      <Separator />

      {/* Features & Bounties */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Why This Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Secure & Auditable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                ReentrancyGuard, Pausable, Ownable. Yield from audited Aave/Yearn/Spark. 1% fee on yield only.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Vesting & Inheritance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                30-day lock, 360 monthly claims. Beneficiary claims after 365 days inactivity.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="space-y-4 p-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <CreditCard className="h-6 w-6 mr-2" />
                Fiat Offramp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                One-click claim + Ramp to USD/bank. Virtual accounts via Stripe Treasury.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="pt-8 pb-8 text-center">
        <Link to="/about">
          <Button variant="ghost" size="sm">
            About & Bounties
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-2">
          Built for Octant v2 Hackathon – Decentralizing Retirement with DeFi.
        </p>
      </footer>
    </div>
  );
};

export default App;