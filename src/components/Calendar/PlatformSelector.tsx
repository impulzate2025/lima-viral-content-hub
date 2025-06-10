
import { Button } from '@/components/ui/button';
import { PLATFORMS } from './types';

interface PlatformSelectorProps {
  selectedPlatform: string;
  onSelect: (platform: string) => void;
}

export function PlatformSelector({ selectedPlatform, onSelect }: PlatformSelectorProps) {
  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'TikTok': return '🎵';
      case 'Instagram': return '📸';
      case 'YouTube': return '📺';
      case 'LinkedIn': return '💼';
      case 'Facebook': return '👥';
      case 'Twitter': return '🐦';
      default: return '📱';
    }
  };

  return (
    <div>
      <label className="text-base font-medium mb-3 block">📱 ¿Dónde lo vas a publicar?</label>
      <div className="grid grid-cols-2 gap-2">
        {PLATFORMS.map(platform => (
          <Button
            key={platform}
            type="button"
            variant={selectedPlatform === platform ? "default" : "outline"}
            onClick={() => onSelect(platform)}
            className="text-base py-4"
          >
            {getPlatformEmoji(platform)} {platform}
          </Button>
        ))}
      </div>
    </div>
  );
}
