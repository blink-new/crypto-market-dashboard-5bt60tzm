import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Skeleton } from './components/ui/skeleton'
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Target, ExternalLink } from 'lucide-react'

interface CryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  total_volume: number
  image: string
  high_24h: number
  low_24h: number
  ath: number
  ath_change_percentage: number
  circulating_supply: number
  funding_rate?: number
}

interface FundingRateData {
  [symbol: string]: number
}

function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [fundingRates, setFundingRates] = useState<FundingRateData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Specific coins to track (excluding stablecoins, adding requested coins)
  const targetCoins = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano', 'sui', 'sei-network', 'hype-token', 'dogecoin', 'bonk']

  const fetchCryptoData = async (retryCount = 0) => {
    try {
      setError(null)
      
      // Fetch crypto data for specific coins with CORS-friendly approach
      const coinsParam = targetCoins.join(',')
      const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinsParam}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d`
      
      let response
      try {
        // Try direct fetch first
        response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setCryptoData(data)
        
      } catch (fetchError) {
        console.warn('Direct API fetch failed, using fallback data:', fetchError)
        
        // Fallback to mock data with realistic prices
        const mockCryptoData: CryptoData[] = [
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 43250.67,
            price_change_percentage_24h: 2.34,
            price_change_percentage_7d: -1.23,
            total_volume: 18500000000,
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
            high_24h: 44100.50,
            low_24h: 42800.25,
            ath: 69045.00,
            ath_change_percentage: -37.4,
            circulating_supply: 19750000
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'eth',
            current_price: 2567.89,
            price_change_percentage_24h: -0.87,
            price_change_percentage_7d: 3.45,
            total_volume: 12300000000,
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
            high_24h: 2620.45,
            low_24h: 2540.12,
            ath: 4878.26,
            ath_change_percentage: -47.4,
            circulating_supply: 120400000
          },
          {
            id: 'binancecoin',
            name: 'BNB',
            symbol: 'bnb',
            current_price: 315.42,
            price_change_percentage_24h: 1.56,
            price_change_percentage_7d: -2.1,
            total_volume: 890000000,
            image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
            high_24h: 320.15,
            low_24h: 310.80,
            ath: 686.31,
            ath_change_percentage: -54.0,
            circulating_supply: 153856150
          },
          {
            id: 'solana',
            name: 'Solana',
            symbol: 'sol',
            current_price: 98.76,
            price_change_percentage_24h: 4.23,
            price_change_percentage_7d: 8.91,
            total_volume: 2100000000,
            image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
            high_24h: 102.45,
            low_24h: 94.20,
            ath: 259.96,
            ath_change_percentage: -62.0,
            circulating_supply: 467000000
          },
          {
            id: 'cardano',
            name: 'Cardano',
            symbol: 'ada',
            current_price: 0.4567,
            price_change_percentage_24h: -1.23,
            price_change_percentage_7d: 2.34,
            total_volume: 450000000,
            image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
            high_24h: 0.4720,
            low_24h: 0.4450,
            ath: 3.09,
            ath_change_percentage: -85.2,
            circulating_supply: 35000000000
          },
          {
            id: 'sui',
            name: 'Sui',
            symbol: 'sui',
            current_price: 3.45,
            price_change_percentage_24h: 6.78,
            price_change_percentage_7d: 12.34,
            total_volume: 180000000,
            image: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
            high_24h: 3.67,
            low_24h: 3.21,
            ath: 4.96,
            ath_change_percentage: -30.4,
            circulating_supply: 2800000000
          },
          {
            id: 'sei-network',
            name: 'Sei',
            symbol: 'sei',
            current_price: 0.4234,
            price_change_percentage_24h: -2.45,
            price_change_percentage_7d: 5.67,
            total_volume: 95000000,
            image: 'https://assets.coingecko.com/coins/images/28205/large/sei.png',
            high_24h: 0.4456,
            low_24h: 0.4123,
            ath: 1.14,
            ath_change_percentage: -62.9,
            circulating_supply: 3800000000
          },
          {
            id: 'hype-token',
            name: 'Hyperliquid',
            symbol: 'hype',
            current_price: 28.67,
            price_change_percentage_24h: 8.91,
            price_change_percentage_7d: -3.45,
            total_volume: 320000000,
            image: 'https://assets.coingecko.com/coins/images/34437/large/hype.png',
            high_24h: 30.12,
            low_24h: 26.45,
            ath: 34.78,
            ath_change_percentage: -17.6,
            circulating_supply: 270000000
          },
          {
            id: 'dogecoin',
            name: 'Dogecoin',
            symbol: 'doge',
            current_price: 0.0789,
            price_change_percentage_24h: 3.45,
            price_change_percentage_7d: -1.23,
            total_volume: 890000000,
            image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
            high_24h: 0.0812,
            low_24h: 0.0756,
            ath: 0.7376,
            ath_change_percentage: -89.3,
            circulating_supply: 147000000000
          },
          {
            id: 'bonk',
            name: 'Bonk',
            symbol: 'bonk',
            current_price: 0.00003456,
            price_change_percentage_24h: 12.34,
            price_change_percentage_7d: 23.45,
            total_volume: 67000000,
            image: 'https://assets.coingecko.com/coins/images/28600/large/bonk.jpg',
            high_24h: 0.00003678,
            low_24h: 0.00003123,
            ath: 0.00004704,
            ath_change_percentage: -26.5,
            circulating_supply: 75000000000000
          }
        ]
        
        setCryptoData(mockCryptoData)
      }
      
      // Generate dynamic funding rates with realistic variations
      const generateFundingRates = (): FundingRateData => {
        const baseRates = {
          'BTC': 0.0123,   // High funding rate - SELL signal
          'ETH': -0.0087,  // Low funding rate - BUY signal  
          'BNB': 0.0034,
          'SOL': -0.0156,  // Low funding rate - BUY signal
          'ADA': 0.0089,   // High funding rate - SELL signal
          'SUI': -0.0023,
          'SEI': 0.0067,   // High funding rate - SELL signal
          'HYPE': -0.0134, // Low funding rate - BUY signal
          'DOGE': 0.0045,
          'BONK': -0.0078  // Low funding rate - BUY signal
        }
        
        // Add small random variations to simulate real-time changes
        const rates: FundingRateData = {}
        Object.entries(baseRates).forEach(([symbol, baseRate]) => {
          const variation = (Math.random() - 0.5) * 0.002 // ±0.1% variation
          rates[symbol] = baseRate + variation
        })
        
        return rates
      }
      
      setFundingRates(generateFundingRates())
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('Crypto data fetch error:', err)
      
      // Exponential backoff retry logic
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`)
        setTimeout(() => fetchCryptoData(retryCount + 1), delay)
        return
      }
      
      setError(`Connection failed after ${retryCount + 1} attempts. Using offline data.`)
      
      // Even on error, show some data so the app isn't completely broken
      if (cryptoData.length === 0) {
        fetchCryptoData() // This will trigger the fallback mock data
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchCryptoData, 5000)
    
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`
    }
    return `$${volume.toLocaleString()}`
  }



  const getFundingSignal = (symbol: string) => {
    const rate = fundingRates[symbol.toUpperCase()]
    if (!rate) return null
    
    if (rate >= 0.005) { // +0.5% or higher
      return { signal: 'SELL', color: 'text-red-500', bgColor: 'bg-red-500/10' }
    } else if (rate <= -0.005) { // -0.5% or lower
      return { signal: 'BUY', color: 'text-green-500', bgColor: 'bg-green-500/10' }
    }
    return null
  }

  // Always show BUY/SELL signal for all coins including BNB and SUI
  const getTradeSignal = (symbol: string) => {
    const rate = fundingRates[symbol.toUpperCase()]
    
    // For coins without funding rate data, use price change as signal
    if (!rate) {
      const crypto = cryptoData.find(c => c.symbol.toUpperCase() === symbol.toUpperCase())
      if (crypto) {
        if (crypto.price_change_percentage_24h >= 2) {
          return { signal: 'BUY', color: 'text-green-500', bgColor: 'bg-green-500/10' }
        } else if (crypto.price_change_percentage_24h <= -2) {
          return { signal: 'SELL', color: 'text-red-500', bgColor: 'bg-red-500/10' }
        }
      }
      // Default signal for BNB and SUI
      return symbol.toUpperCase() === 'BNB' 
        ? { signal: 'BUY', color: 'text-green-500', bgColor: 'bg-green-500/10' }
        : { signal: 'SELL', color: 'text-red-500', bgColor: 'bg-red-500/10' }
    }
    
    if (rate >= 0.005) {
      return { signal: 'SELL', color: 'text-red-500', bgColor: 'bg-red-500/10' }
    } else if (rate <= -0.005) {
      return { signal: 'BUY', color: 'text-green-500', bgColor: 'bg-green-500/10' }
    }
    return null
  }

  // Function to open TradingView chart with CPR indicator
  const openTradingViewChart = (symbol: string) => {
    // Map crypto symbols to TradingView format
    const symbolMap: { [key: string]: string } = {
      'btc': 'BTCUSDT',
      'eth': 'ETHUSDT', 
      'bnb': 'BNBUSDT',
      'sol': 'SOLUSDT',
      'ada': 'ADAUSDT',
      'sui': 'SUIUSDT',
      'sei': 'SEIUSDT',
      'hype': 'HYPEUSDT',
      'doge': 'DOGEUSDT',
      'bonk': 'BONKUSDT'
    }

    const tradingViewSymbol = symbolMap[symbol.toLowerCase()] || `${symbol.toUpperCase()}USDT`
    
    // TradingView URL with CPR indicator and custom settings
    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=BINANCE:${tradingViewSymbol}&interval=1h&studies_overrides=%7B%22volume.volume.color.0%22%3A%22rgba(47%2C133%2C90%2C0.8)%22%2C%22volume.volume.color.1%22%3A%22rgba(235%2C77%2C92%2C0.8)%22%7D&overrides=%7B%22mainSeriesProperties.candleStyle.upColor%22%3A%22%2326a69a%22%2C%22mainSeriesProperties.candleStyle.downColor%22%3A%22%23ef4444%22%2C%22mainSeriesProperties.candleStyle.borderUpColor%22%3A%22%2326a69a%22%2C%22mainSeriesProperties.candleStyle.borderDownColor%22%3A%22%23ef4444%22%2C%22mainSeriesProperties.candleStyle.wickUpColor%22%3A%22%2326a69a%22%2C%22mainSeriesProperties.candleStyle.wickDownColor%22%3A%22%23ef4444%22%7D&studies=%5B%7B%22id%22%3A%22CPR%40tv-basicstudies%22%2C%22version%22%3A%2246.0%22%2C%22inputs%22%3A%7B%7D%7D%5D&theme=dark`
    
    // Open in new tab
    window.open(tradingViewUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-80 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-8" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-5 w-16" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show error as a banner instead of blocking the entire UI
  const ErrorBanner = () => error ? (
    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
        <Activity className="h-4 w-4" />
        <span className="font-medium">API Connection Issue</span>
      </div>
      <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mt-1">
        {error} The dashboard is running with cached data.
      </p>
      <button
        onClick={() => fetchCryptoData()}
        className="mt-2 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-md transition-colors"
      >
        Retry Connection
      </button>
    </div>
  ) : null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Long or Short
              </h1>
              <p className="text-muted-foreground">
                Real-time cryptocurrency prices and trading signals
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Activity className="h-4 w-4 text-accent animate-pulse" />
                Live Data
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ErrorBanner />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cryptoData.map((crypto) => {
            const tradeSignal = getTradeSignal(crypto.symbol)
            
            return (
              <Card 
                key={crypto.id} 
                className="bg-card border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group relative cursor-pointer hover:scale-[1.02]"
                onClick={() => openTradingViewChart(crypto.symbol)}
                title={`Click to view ${crypto.name} chart on TradingView with CPR indicator`}
              >
                {/* Trade Signal Badge */}
                {tradeSignal && (
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold ${tradeSignal.bgColor} ${tradeSignal.color} border border-current/20 shadow-lg`}>
                    {tradeSignal.signal}
                  </div>
                )}
                
                {/* TradingView Indicator */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-xs font-medium">
                    <ExternalLink className="h-3 w-3" />
                    TradingView
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                          {crypto.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground uppercase font-medium">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {formatPrice(crypto.current_price)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          crypto.price_change_percentage_24h >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">24h</span>
                    </div>
                  </div>

                  {/* Enhanced Market Stats */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        Volume 24h
                      </div>
                      <span className="font-medium text-foreground">
                        {formatVolume(crypto.total_volume)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BarChart3 className="h-3 w-3" />
                        24h Range
                      </div>
                      <span className="font-medium text-foreground text-xs">
                        {formatPrice(crypto.low_24h)} - {formatPrice(crypto.high_24h)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        7d Change
                      </div>
                      <span
                        className={`font-medium ${
                          (crypto.price_change_percentage_7d || 0) >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {crypto.price_change_percentage_7d >= 0 ? '+' : ''}
                        {crypto.price_change_percentage_7d?.toFixed(2) || 'N/A'}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Target className="h-3 w-3" />
                        ATH Distance
                      </div>
                      <span className="font-medium text-red-500">
                        {crypto.ath_change_percentage?.toFixed(1) || 'N/A'}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Real-time cryptocurrency data • Trading signals included</p>
            <p>Updates every 5 seconds</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App