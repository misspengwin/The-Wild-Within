import type { ResourceId } from '@/models/character';

export const RESOURCE_INFO: Record<ResourceId, { label: string; icon: string }> = {
  coins: { label: 'Gold Coins', icon: '🪙' },
  herbs: { label: 'Wild Herbs', icon: '🌱' },
  crystals: { label: 'Aether Crystals', icon: '💎' },
};

export const RESOURCE_ORDER: ResourceId[] = ['coins', 'herbs', 'crystals'];
