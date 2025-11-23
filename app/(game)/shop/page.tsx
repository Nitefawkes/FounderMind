'use client'

import { useState, useEffect } from 'react'
import { CoinShopEngine } from '@/lib/shop/CoinShopEngine'
import ShopItemCard from '@/components/shop/ShopItemCard'
import type { ShopItemCategory, ShopItem } from '@/lib/types/shop.types'
import { motion } from 'framer-motion'

type TabType = 'featured' | 'boosts' | 'multipliers' | 'utilities' | 'cosmetics' | 'all'

export default function ShopPage() {
  const [shopEngine, setShopEngine] = useState<CoinShopEngine | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('featured')
  const [coins, setCoins] = useState(0)
  const [items, setItems] = useState<ShopItem[]>([])
  const [playerLevel] = useState(1) // TODO: Get from actual player data

  useEffect(() => {
    const engine = CoinShopEngine.load()
    setShopEngine(engine)
    setCoins(engine.getCoins())

    // Load items based on tab
    loadItems(engine, activeTab)
  }, [activeTab])

  const loadItems = (engine: CoinShopEngine, tab: TabType) => {
    let itemsList: ShopItem[] = []

    switch (tab) {
      case 'featured':
        itemsList = engine.getFeaturedItems(playerLevel)
        break
      case 'all':
        itemsList = engine.getAvailableItems(playerLevel)
        break
      default:
        itemsList = engine.getItemsByCategory(tab, playerLevel)
    }

    setItems(itemsList)
  }

  const handlePurchase = (itemId: string) => {
    if (!shopEngine) return

    const result = shopEngine.purchase(itemId)

    if (result.success) {
      // Show success message
      alert(`✅ ${result.message}`)
      setCoins(shopEngine.getCoins())
      shopEngine.save()

      // Reload items to update owned status
      loadItems(shopEngine, activeTab)
    } else {
      // Show error message
      alert(`❌ ${result.message}`)
    }
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'featured', label: 'Featured', icon: '⭐' },
    { id: 'boosts', label: 'Boosts', icon: '🚀' },
    { id: 'multipliers', label: 'Multipliers', icon: '📈' },
    { id: 'utilities', label: 'Utilities', icon: '🔧' },
    { id: 'cosmetics', label: 'Cosmetics', icon: '🎨' },
    { id: 'all', label: 'All Items', icon: '🛍️' }
  ]

  if (!shopEngine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-black to-cyber-dark p-6 flex items-center justify-center">
        <div className="text-neon-green text-xl">Loading shop...</div>
      </div>
    )
  }

  const stats = shopEngine.getPurchaseStats()
  const activeBoosts = shopEngine.getActiveBoosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-dark via-black to-cyber-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neon-green mb-2">
            🛒 Founder Coin Shop
          </h1>
          <p className="text-gray-400">
            Boost your startup, unlock premium features, and customize your experience
          </p>
        </div>

        {/* Coin Balance & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-neon-green/20 to-neon-blue/20 border border-neon-green rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Your Balance</div>
            <div className="text-3xl font-bold text-neon-green">{coins} coins</div>
            <div className="text-xs text-gray-400 mt-1">Earned from challenges & rewards</div>
          </div>

          <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-white">{stats.totalSpent} coins</div>
            <div className="text-xs text-gray-400 mt-1">{stats.totalPurchases} purchases</div>
          </div>

          <div className="bg-cyber-dark border border-neon-pink/30 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">Active Boosts</div>
            <div className="text-2xl font-bold text-neon-pink">{activeBoosts.length}</div>
            <div className="text-xs text-gray-400 mt-1">Currently active effects</div>
          </div>

          <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-1">XP Multiplier</div>
            <div className="text-2xl font-bold text-neon-green">
              {shopEngine.getMultiplier('xp').toFixed(1)}x
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Coin: {shopEngine.getMultiplier('coins').toFixed(1)}x
            </div>
          </div>
        </div>

        {/* Active Boosts Display */}
        {activeBoosts.length > 0 && (
          <div className="mb-8 bg-neon-blue/10 border border-neon-blue rounded-lg p-4">
            <h3 className="text-lg font-bold text-neon-blue mb-3">⚡ Active Boosts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeBoosts.map((boost, index) => {
                const timeRemaining = boost.expiresAt
                  ? Math.max(0, Math.floor((boost.expiresAt.getTime() - Date.now()) / 60000))
                  : null

                return (
                  <div
                    key={index}
                    className="bg-black/30 border border-neon-blue/30 rounded p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">
                        {boost.effect.type === 'multiplier' && `${boost.effect.multiplier}x ${boost.effect.target}`}
                        {boost.effect.type === 'metric-boost' && `+${boost.effect.amount} ${boost.effect.metric}`}
                      </span>
                      {timeRemaining !== null && (
                        <span className="text-xs text-gray-400">{timeRemaining}m left</span>
                      )}
                    </div>
                    {timeRemaining !== null && (
                      <div className="w-full bg-black/50 rounded-full h-1">
                        <div
                          className="bg-neon-blue h-1 rounded-full transition-all"
                          style={{
                            width: `${(timeRemaining / (boost.effect.type === 'multiplier' || boost.effect.type === 'metric-boost' ? boost.effect.duration || 1 : 1)) * 100}%`
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-neon-green/30 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-neon-green/20 text-neon-green border-b-2 border-neon-green'
                  : 'text-gray-400 hover:text-white hover:bg-cyber-dark'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12 bg-cyber-dark border border-neon-green/30 rounded-lg">
            <p className="text-gray-400 text-lg mb-2">No items in this category yet</p>
            <p className="text-sm text-gray-500">Check back soon for new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => {
              const finalPrice = shopEngine.getFinalPrice(item)
              const { canPurchase, reason } = shopEngine.canPurchase(item.id)
              const isOwned = shopEngine.ownsItem(item.id)

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ShopItemCard
                    item={item}
                    finalPrice={finalPrice}
                    canPurchase={canPurchase}
                    purchaseReason={reason}
                    onPurchase={handlePurchase}
                    isOwned={isOwned}
                  />
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-cyber-dark border border-neon-blue/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-neon-blue mb-4">💡 How to Earn Coins</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-bold text-white mb-1">Daily Challenges</div>
              <p className="text-gray-400">Complete challenges to earn 40-600 coins daily</p>
            </div>
            <div>
              <div className="font-bold text-white mb-1">Achievements</div>
              <p className="text-gray-400">Unlock achievements for coin bonuses</p>
            </div>
            <div>
              <div className="font-bold text-white mb-1">Competitions</div>
              <p className="text-gray-400">Win multiplayer matches for coin rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
