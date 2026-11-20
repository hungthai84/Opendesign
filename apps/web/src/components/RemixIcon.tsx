import type { CSSProperties } from 'react';
import * as LucideIcons from 'lucide-react';

import { REMIX_ICON_PATHS } from './remix-icon-paths';

interface RemixIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const REMIX_TO_LUCIDE: Record<string, React.ComponentType<any>> = {
  'menu-line': LucideIcons.Menu,
  'menu-2-line': LucideIcons.Menu,
  'menu-3-line': LucideIcons.Menu,
  'settings-line': LucideIcons.Settings,
  'settings-3-line': LucideIcons.Settings,
  'arrow-left-line': LucideIcons.ArrowLeft,
  'arrow-right-line': LucideIcons.ArrowRight,
  'arrow-down-s-line': LucideIcons.ChevronDown,
  'arrow-up-s-line': LucideIcons.ChevronUp,
  'arrow-left-s-line': LucideIcons.ChevronLeft,
  'arrow-right-s-line': LucideIcons.ChevronRight,
  'link': LucideIcons.Link,
  'search-line': LucideIcons.Search,
  'book-read-line': LucideIcons.BookOpen,
  'image-line': LucideIcons.Image,
  'image-add-line': LucideIcons.ImagePlus,
  'video-line': LucideIcons.Video,
  'video-ai-line': LucideIcons.Video,
  'code-s-slash-line': LucideIcons.Code,
  'code-line': LucideIcons.Code,
  'folder-line': LucideIcons.Folder,
  'folder-2-line': LucideIcons.Folder,
  'refresh-line': LucideIcons.RefreshCw,
  'reset-left-line': LucideIcons.RotateCcw,
  'camera-line': LucideIcons.Camera,
  'screenshot-2-line': LucideIcons.Camera,
  'chat-new-line': LucideIcons.MessageSquarePlus,
  'chat-1-line': LucideIcons.MessageSquare,
  'mark-pen-line': LucideIcons.PenTool,
  'edit-line': LucideIcons.Edit3,
  'message-3-line': LucideIcons.MessageCircle,
  'more-2-line': LucideIcons.MoreVertical,
  'more-line': LucideIcons.MoreHorizontal,
  'history-line': LucideIcons.History,
  'zoom-in-line': LucideIcons.ZoomIn,
  'zoom-out-line': LucideIcons.ZoomOut,
  'slideshow-3-line': LucideIcons.Presentation,
  'eye-line': LucideIcons.Eye,
  'eye-off-line': LucideIcons.EyeOff,
  'play-line': LucideIcons.Play,
  'pause-line': LucideIcons.Pause,
  'share-forward-line': LucideIcons.Share2,
  'share-line': LucideIcons.Share2,
  'download-line': LucideIcons.Download,
  'download-2-line': LucideIcons.Download,
  'upload-line': LucideIcons.Upload,
  'upload-2-line': LucideIcons.Upload,
  'file-line': LucideIcons.File,
  'file-code-line': LucideIcons.FileCode,
  'file-zip-line': LucideIcons.Archive,
  'file-ppt-line': LucideIcons.Presentation,
  'file-text-line': LucideIcons.FileText,
  'file-copy-line': LucideIcons.Copy,
  'close-line': LucideIcons.X,
  'add-line': LucideIcons.Plus,
  'add-fill': LucideIcons.PlusCircle,
  'information-line': LucideIcons.Info,
  'tv-line': LucideIcons.Monitor,
  'computer-line': LucideIcons.Monitor,
  'tablet-line': LucideIcons.Tablet,
  'smartphone-line': LucideIcons.Smartphone,
  'layout-left-line': LucideIcons.PanelLeft,
  'layout-right-line': LucideIcons.PanelRight,
  'arrow-go-back-line': LucideIcons.Undo,
  'arrow-go-forward-line': LucideIcons.Redo,
  'delete-bin-line': LucideIcons.Trash2,
  'battery-charge-line': LucideIcons.BatteryCharging,
  'wallet-line': LucideIcons.Wallet,
  'checkbox-line': LucideIcons.CheckSquare,
  'checkbox-blank-line': LucideIcons.Square,
  'notification-3-line': LucideIcons.Bell,
  'layout-grid-line': LucideIcons.Boxes,
  'brain-line': LucideIcons.Brain,
  'check-line': LucideIcons.Check,
  'dashboard-line': LucideIcons.LayoutDashboard,
  'brush-line': LucideIcons.PenTool,
  'external-link-line': LucideIcons.ExternalLink,
  'inbox-archive-line': LucideIcons.Archive,
  'sparkling-line': LucideIcons.Sparkles,
  'sparkling-2-fill': LucideIcons.Sparkles,
  'loader-4-line': LucideIcons.Loader2,
  'sun-line': LucideIcons.Sun,
  'moon-line': LucideIcons.Moon,
  'sun-foggy-line': LucideIcons.SunMoon,
  'terminal-box-line': LucideIcons.Terminal,
  'thumb-down-line': LucideIcons.ThumbsDown,
  'thumb-up-line': LucideIcons.ThumbsUp,
  'translate': LucideIcons.Languages,
  'sound-module-line': LucideIcons.SlidersHorizontal,
  'group-line': LucideIcons.Users,
  'volume-up-line': LucideIcons.Volume2,
  'send-plane-2-line': LucideIcons.Send,
  'keynote-line': LucideIcons.Presentation,
  'puzzle-line': LucideIcons.Puzzle,
  'equalizer-line': LucideIcons.Sliders,
  'artboard-2-line': LucideIcons.Layout,
  'attachment-2': LucideIcons.Paperclip,
  'bar-chart-box-line': LucideIcons.BarChart2,
  'input-field': LucideIcons.TextCursor,
  'list-check-2': LucideIcons.ListChecks,
};

/**
 * Icons rendered via Lucide React, falling back to inline vector SVG.
 */
export function RemixIcon({ name, size = 14, className, style }: RemixIconProps) {
  const LucideComp = REMIX_TO_LUCIDE[name];
  if (LucideComp) {
    return (
      <LucideComp
        size={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-hidden="true"
        focusable="false"
      />
    );
  }

  const d = REMIX_ICON_PATHS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {d ? <path d={d} /> : null}
    </svg>
  );
}
