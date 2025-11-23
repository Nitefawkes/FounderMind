/**
 * Coin Shop Engine
 * Handles virtual currency, purchases, inventory, and boosts
 */

import type {
  ShopItem,
  PlayerInventory,
  Purchase,
  ActiveBoost,
  InventoryItem,
  ShopItemEffect,
  PremiumTier,
} from '@/lib/types/shop.types'
import { SHOP_CATALOG, PREMIUM_TIERS } from '@/lib/types/shop.types'

export class CoinShopEngine {
  private inventory: PlayerInventory
  private premiumTier: PremiumTier

  constructor(inventory?: PlayerInventory, premiumTier: PremiumTier = 'free') {
    this.inventory = inventory || {
      userId: '',
      coins: 0,
      items: [],
      activeBoosts: [],
      cosmetics: [],
      purchaseHistory: []
    }
    this.premiumTier = premiumTier
  }

  /**
   * Get player's coin balance
   */
  getCoins(): number {
    return this.inventory.coins
  }

  /**
   * Add coins to player's balance
   */
  addCoins(amount: number, source: string = 'reward'): void {
    this.inventory.coins += amount
    console.log(`+${amount} coins from ${source}. New balance: ${this.inventory.coins}`)
  }

  /**
   * Get available shop items (filtered by premium tier and level)
   */
  getAvailableItems(playerLevel: number = 1): ShopItem[] {
    return SHOP_CATALOG.filter(item => {
      // Check level requirement
      if (item.requiredLevel && playerLevel < item.requiredLevel) {
        return false
      }

      // Check premium tier requirement
      if (item.requiresPremium) {
        const tierOrder: PremiumTier[] = ['free', 'founder', 'accelerator']
        const requiredIndex = tierOrder.indexOf(item.requiresPremium)
        const playerIndex = tierOrder.indexOf(this.premiumTier)
        if (playerIndex < requiredIndex) {
          return false
        }
      }

      return true
    })
  }

  /**
   * Get items by category
   */
  getItemsByCategory(category: string, playerLevel: number = 1): ShopItem[] {
    return this.getAvailableItems(playerLevel).filter(item => item.category === category)
  }

  /**
   * Get featured items
   */
  getFeaturedItems(playerLevel: number = 1): ShopItem[] {
    return this.getAvailableItems(playerLevel).filter(item => item.isFeatured)
  }

  /**
   * Get items on sale
   */
  getSaleItems(playerLevel: number = 1): ShopItem[] {
    const now = new Date()
    return this.getAvailableItems(playerLevel).filter(
      item => item.onSale && item.onSale.endsAt > now
    )
  }

  /**
   * Calculate final price with sales
   */
  getFinalPrice(item: ShopItem): number {
    let price = item.price.coins

    if (item.onSale) {
      const now = new Date()
      if (item.onSale.endsAt > now) {
        price = Math.floor(price * (1 - item.onSale.discountPercent / 100))
      }
    }

    return price
  }

  /**
   * Check if player can purchase item
   */
  canPurchase(itemId: string): {
    canPurchase: boolean
    reason?: string
  } {
    const item = SHOP_CATALOG.find(i => i.id === itemId)
    if (!item) {
      return { canPurchase: false, reason: 'Item not found' }
    }

    // Check coins
    const finalPrice = this.getFinalPrice(item)
    if (this.inventory.coins < finalPrice) {
      return { canPurchase: false, reason: `Not enough coins. Need ${finalPrice - this.inventory.coins} more.` }
    }

    // Check purchase limit
    if (item.purchaseLimit) {
      const purchases = this.getPurchaseCount(itemId, item.purchaseLimit.type)
      if (purchases >= item.purchaseLimit.amount) {
        return { canPurchase: false, reason: `Purchase limit reached (${item.purchaseLimit.amount}/${item.purchaseLimit.type})` }
      }
    }

    // Check premium tier
    if (item.requiresPremium) {
      const tierOrder: PremiumTier[] = ['free', 'founder', 'accelerator']
      const requiredIndex = tierOrder.indexOf(item.requiresPremium)
      const playerIndex = tierOrder.indexOf(this.premiumTier)
      if (playerIndex < requiredIndex) {
        return { canPurchase: false, reason: `Requires ${item.requiresPremium} tier` }
      }
    }

    return { canPurchase: true }
  }

  /**
   * Get purchase count within time period
   */
  private getPurchaseCount(itemId: string, period: 'daily' | 'weekly' | 'lifetime'): number {
    const now = new Date()
    const purchases = this.inventory.purchaseHistory.filter(p => p.itemId === itemId)

    if (period === 'lifetime') {
      return purchases.length
    }

    const cutoff = new Date()
    if (period === 'daily') {
      cutoff.setHours(0, 0, 0, 0)
    } else if (period === 'weekly') {
      cutoff.setDate(cutoff.getDate() - 7)
    }

    return purchases.filter(p => p.purchasedAt >= cutoff).length
  }

  /**
   * Purchase an item
   */
  purchase(itemId: string): {
    success: boolean
    message: string
    purchase?: Purchase
    effects?: ShopItemEffect[]
  } {
    const item = SHOP_CATALOG.find(i => i.id === itemId)
    if (!item) {
      return { success: false, message: 'Item not found' }
    }

    const check = this.canPurchase(itemId)
    if (!check.canPurchase) {
      return { success: false, message: check.reason || 'Cannot purchase' }
    }

    const finalPrice = this.getFinalPrice(item)

    // Deduct coins
    this.inventory.coins -= finalPrice

    // Create purchase record
    const purchase: Purchase = {
      id: `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itemId: item.id,
      price: finalPrice,
      purchasedAt: new Date(),
      paymentMethod: 'coins'
    }

    this.inventory.purchaseHistory.push(purchase)

    // Add to inventory or apply effects
    const existingItem = this.inventory.items.find(i => i.shopItemId === itemId)
    if (existingItem) {
      existingItem.quantity++
    } else {
      this.inventory.items.push({
        shopItemId: itemId,
        quantity: 1,
        purchasedAt: new Date()
      })
    }

    // Auto-activate effects
    this.activateItemEffects(item)

    return {
      success: true,
      message: `Purchased ${item.name} for ${finalPrice} coins!`,
      purchase,
      effects: item.effects
    }
  }

  /**
   * Activate item effects
   */
  private activateItemEffects(item: ShopItem): void {
    item.effects.forEach(effect => {
      if (effect.type === 'multiplier' || effect.type === 'metric-boost') {
        const expiresAt = effect.duration
          ? new Date(Date.now() + effect.duration * 60 * 1000)
          : undefined

        this.inventory.activeBoosts.push({
          itemId: item.id,
          effect,
          activatedAt: new Date(),
          expiresAt
        })
      } else if (effect.type === 'cosmetic') {
        if (!this.inventory.cosmetics.includes(effect.cosmetic.id)) {
          this.inventory.cosmetics.push(effect.cosmetic.id)
        }
      }
      // Other effects (unlocks, time-skip, special) handled by game logic
    })
  }

  /**
   * Get active boosts
   */
  getActiveBoosts(): ActiveBoost[] {
    // Remove expired boosts
    const now = new Date()
    this.inventory.activeBoosts = this.inventory.activeBoosts.filter(
      boost => !boost.expiresAt || boost.expiresAt > now
    )

    return this.inventory.activeBoosts
  }

  /**
   * Get multiplier for specific target
   */
  getMultiplier(target: 'xp' | 'coins' | 'all-rewards'): number {
    const activeBoosts = this.getActiveBoosts()
    let multiplier = 1

    activeBoosts.forEach(boost => {
      if (boost.effect.type === 'multiplier') {
        if (boost.effect.target === target || boost.effect.target === 'all-rewards') {
          multiplier *= boost.effect.multiplier
        }
      }
    })

    return multiplier
  }

  /**
   * Apply coin reward with multipliers
   */
  applyReward(baseAmount: number, type: 'xp' | 'coins' = 'coins'): number {
    const multiplier = this.getMultiplier(type)
    const finalAmount = Math.floor(baseAmount * multiplier)

    if (type === 'coins') {
      this.addCoins(finalAmount, 'reward')
    }

    return finalAmount
  }

  /**
   * Get owned items
   */
  getOwnedItems(): InventoryItem[] {
    return this.inventory.items
  }

  /**
   * Check if item is owned
   */
  ownsItem(itemId: string): boolean {
    return this.inventory.items.some(i => i.shopItemId === itemId)
  }

  /**
   * Get total spent
   */
  getTotalSpent(): number {
    return this.inventory.purchaseHistory.reduce((sum, p) => sum + p.price, 0)
  }

  /**
   * Get purchase stats
   */
  getPurchaseStats(): {
    totalPurchases: number
    totalSpent: number
    favoriteCategory?: string
    recentPurchases: Purchase[]
  } {
    const totalPurchases = this.inventory.purchaseHistory.length
    const totalSpent = this.getTotalSpent()

    // Find favorite category
    const categoryCount: Record<string, number> = {}
    this.inventory.purchaseHistory.forEach(purchase => {
      const item = SHOP_CATALOG.find(i => i.id === purchase.itemId)
      if (item) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1
      }
    })

    const favoriteCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0]

    // Recent purchases (last 10)
    const recentPurchases = [...this.inventory.purchaseHistory]
      .sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime())
      .slice(0, 10)

    return {
      totalPurchases,
      totalSpent,
      favoriteCategory,
      recentPurchases
    }
  }

  /**
   * Get inventory
   */
  getInventory(): PlayerInventory {
    return { ...this.inventory }
  }

  /**
   * Save inventory to localStorage
   */
  save(): void {
    localStorage.setItem('playerInventory', JSON.stringify(this.inventory))
  }

  /**
   * Load inventory from localStorage
   */
  static load(premiumTier: PremiumTier = 'free'): CoinShopEngine {
    const saved = localStorage.getItem('playerInventory')
    if (saved) {
      const inventory = JSON.parse(saved)
      // Convert date strings back to Date objects
      inventory.purchaseHistory = inventory.purchaseHistory.map((p: any) => ({
        ...p,
        purchasedAt: new Date(p.purchasedAt)
      }))
      inventory.activeBoosts = inventory.activeBoosts.map((b: any) => ({
        ...b,
        activatedAt: new Date(b.activatedAt),
        expiresAt: b.expiresAt ? new Date(b.expiresAt) : undefined
      }))
      return new CoinShopEngine(inventory, premiumTier)
    }

    return new CoinShopEngine(undefined, premiumTier)
  }
}

/**
 * Premium tier checker
 */
export class PremiumTierChecker {
  private tier: PremiumTier

  constructor(tier: PremiumTier = 'free') {
    this.tier = tier
  }

  /**
   * Check if feature is available
   */
  canUseFeature(featureId: string): boolean {
    const config = PREMIUM_TIERS[this.tier]

    switch (featureId) {
      case 'multiple-startups':
        return config.limits.activeStartups > 1
      case 'unlimited-scenarios':
        return config.limits.scenariosPerDay === 'unlimited'
      case 'unlimited-advisors':
        return config.limits.advisorQuestions === 'unlimited'
      case 'unlimited-compete':
        return config.limits.competitionMatches === 'unlimited'
      case 'custom-scenarios':
        return config.limits.customScenarios
      case 'api-access':
        return config.limits.apiAccess
      case 'priority-support':
        return config.limits.prioritySupport
      default:
        return false
    }
  }

  /**
   * Get feature limit
   */
  getFeatureLimit(featureId: string): number | 'unlimited' {
    const config = PREMIUM_TIERS[this.tier]

    switch (featureId) {
      case 'active-startups':
        return config.limits.activeStartups
      case 'scenarios-per-day':
        return config.limits.scenariosPerDay
      case 'advisor-questions':
        return config.limits.advisorQuestions
      case 'competition-matches':
        return config.limits.competitionMatches
      case 'daily-challenges':
        return config.limits.dailyChallenges
      case 'cloud-saves':
        return config.limits.cloudSaves
      default:
        return 0
    }
  }

  /**
   * Get tier config
   */
  getTierConfig(): typeof PREMIUM_TIERS[PremiumTier] {
    return PREMIUM_TIERS[this.tier]
  }

  /**
   * Get all tiers for comparison
   */
  getAllTiers(): typeof PREMIUM_TIERS {
    return PREMIUM_TIERS
  }
}
