'use client'

import { useState } from 'react'
import type { ShopItem } from '@/lib/types/shop.types'
import { motion } from 'framer-motion'

interface ShopItemCardProps {
  item: ShopItem
  finalPrice: number
  canPurchase: boolean
  purchaseReason?: string
  onPurchase: (itemId: string) => void
  isOwned?: boolean
}

const RARITY_STYLES = {
  common: {
    bg: 'bg-gray-500/10',
    border: 'border-gray-500',
    text: 'text-gray-400',
    glow: 'shadow-gray-500/20'
  },
  rare: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/30'
  },
  epic: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/40'
  },
  legendary: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/50'
  }
}

export default function ShopItemCard({
  item,
  finalPrice,
  canPurchase,
  purchaseReason,
  onPurchase,
  isOwned = false
}: ShopItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const rarityStyle = RARITY_STYLES[item.rarity]

  const hasDiscount = item.onSale && item.price.coins !== finalPrice
  const discountPercent = item.onSale?.discountPercent

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-lg border-2 p-4 transition-all ${rarityStyle.bg} ${rarityStyle.border} shadow-lg ${rarityStyle.glow}`}
    >
      {/* Badges */}
      <div className="absolute -top-2 -right-2 flex flex-col gap-1">
        {item.isNew && (
          <span className="bg-neon-pink border-2 border-white rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg">
            NEW
          </span>
        )}
        {item.isFeatured && (
          <span className="bg-neon-blue border-2 border-white rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg">
            ⭐ FEATURED
          </span>
        )}
        {item.isBestValue && (
          <span className="bg-neon-green border-2 border-white rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg">
            💎 BEST
          </span>
        )}
        {hasDiscount && (
          <span className="bg-red-500 border-2 border-white rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Owned Badge */}
      {isOwned && (
        <div className="absolute -top-2 -left-2 bg-neon-green border-2 border-white rounded-full px-2 py-1 text-xs font-bold text-white shadow-lg">
          ✓ OWNED
        </div>
      )}

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="text-5xl">{item.icon}</div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">{item.name}</h3>
            <span className={`text-xs px-2 py-1 rounded ${rarityStyle.bg} ${rarityStyle.text} border ${rarityStyle.border}`}>
              {item.rarity.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300">{item.description}</p>

        {/* Effects Preview */}
        <div className="space-y-1">
          {item.effects.slice(0, 2).map((effect, index) => (
            <div key={index} className="text-xs text-neon-blue">
              {effect.type === 'metric-boost' && (
                <span>📊 +{effect.amount} {effect.metric} {effect.duration && `for ${effect.duration}m`}</span>
              )}
              {effect.type === 'multiplier' && (
                <span>⚡ {effect.multiplier}x {effect.target} for {effect.duration}m</span>
              )}
              {effect.type === 'unlock' && (
                <span>🔓 Unlocks {effect.unlocks.length} item(s)</span>
              )}
              {effect.type === 'cosmetic' && (
                <span>🎨 {effect.cosmetic.type}: {effect.cosmetic.id}</span>
              )}
              {effect.type === 'time-skip' && (
                <span>⏩ Skip {effect.skipAmount} days</span>
              )}
            </div>
          ))}
          {item.effects.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-400 hover:text-white"
            >
              {isExpanded ? '▼' : '▶'} {item.effects.length - 2} more effects
            </button>
          )}
        </div>

        {/* Expanded Effects */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-1 pt-2 border-t border-gray-700"
          >
            {item.effects.slice(2).map((effect, index) => (
              <div key={index} className="text-xs text-neon-blue">
                {effect.type === 'metric-boost' && (
                  <span>📊 +{effect.amount} {effect.metric}</span>
                )}
                {effect.type === 'multiplier' && (
                  <span>⚡ {effect.multiplier}x {effect.target}</span>
                )}
                {effect.type === 'unlock' && (
                  <span>🔓 Unlocks: {effect.unlocks.join(', ')}</span>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Purchase Limit */}
        {item.purchaseLimit && (
          <div className="text-xs text-gray-400">
            Limit: {item.purchaseLimit.amount}/{item.purchaseLimit.type}
          </div>
        )}

        {/* Requirements */}
        {(item.requiresPremium || item.requiredLevel) && (
          <div className="flex flex-wrap gap-2">
            {item.requiresPremium && (
              <span className="text-xs px-2 py-1 bg-neon-pink/20 border border-neon-pink/30 rounded text-neon-pink">
                Requires: {item.requiresPremium}
              </span>
            )}
            {item.requiredLevel && (
              <span className="text-xs px-2 py-1 bg-neon-blue/20 border border-neon-blue/30 rounded text-neon-blue">
                Level {item.requiredLevel}+
              </span>
            )}
          </div>
        )}

        {/* Price & Purchase */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div>
            <div className="flex items-center space-x-2">
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {item.price.coins} coins
                </span>
              )}
              <div className="text-xl font-bold text-neon-green">
                {finalPrice} coins
              </div>
            </div>
            {item.price.realMoney && (
              <div className="text-xs text-gray-400">
                or ${(item.price.realMoney / 100).toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={() => onPurchase(item.id)}
            disabled={!canPurchase || isOwned}
            className={`px-4 py-2 rounded font-bold transition-all ${
              canPurchase && !isOwned
                ? 'bg-neon-green/20 border border-neon-green text-neon-green hover:bg-neon-green/30'
                : 'bg-gray-800 border border-gray-600 text-gray-500 cursor-not-allowed'
            }`}
            title={!canPurchase ? purchaseReason : isOwned ? 'Already owned' : 'Purchase'}
          >
            {isOwned ? 'Owned' : 'Buy Now'}
          </button>
        </div>

        {/* Purchase Reason */}
        {!canPurchase && purchaseReason && (
          <div className="text-xs text-red-400">
            ⚠️ {purchaseReason}
          </div>
        )}
      </div>
    </motion.div>
  )
}
