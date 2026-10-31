export { HeaderUserMenu } from './components/HeaderUserMenu';
export type { HeaderUserMenuProps } from './components/HeaderUserMenu/_HeaderUserMenu.types';
export { TextField } from './components/TextField';
export type { TextFieldProps } from './components/TextField/_TextField.types';
export { UserProfileDialog } from './components/UserProfileDialog';
export type { UserProfileDialogProps } from './components/UserProfileDialog/_UserProfileDialog.types';
export { GameLandingTemplate } from './layouts/GameLandingTemplate';
export type {
	GameLandingContentWidth,
	GameLandingTemplateProps,
	PageFooterLink,
	ResumeStateConfig,
} from './layouts/GameLandingTemplate';
export { OfflineToggle } from './components/OfflineToggle/OfflineToggle';
export type { OfflineToggleProps } from './components/OfflineToggle/OfflineToggle';
export { GameOfflineToolbar } from './components/GameOfflineToolbar';
export type { GameOfflineToolbarProps } from './components/GameOfflineToolbar';
export { useOfflineGame, formatBytes } from './hooks/useOfflineGame';
export type {
	GameManifestData,
	OfflineGameStatus,
	UseOfflineGameResult,
} from './hooks/useOfflineGame';
export { Dialog } from './components/Dialog';
export type { DialogProps } from './components/Dialog';
export { VictoryDialog } from './components/VictoryDialog';
export type { VictoryDialogProps, VictoryStatItem } from './components/VictoryDialog';
export { PauseDialog } from './components/PauseDialog';
export type { PauseDialogProps } from './components/PauseDialog';
export { Breadcrumb } from './components/Breadcrumb';
export type { BreadcrumbItem, BreadcrumbProps } from './components/Breadcrumb/_Breadcrumb.types';
export { ClickableCard } from './components/ClickableCard';
export type { ClickableCardProps } from './components/ClickableCard/_ClickableCard.types';
export { Badge } from './components/Badge';
export type { BadgeProps } from './components/Badge/_Badge.types';
export { SegmentedControl } from './components/SegmentedControl';
export type {
	SegmentedControlItem,
	SegmentedControlOption,
	SegmentedControlProps,
	SegmentedControlSize,
} from './components/SegmentedControl/_SegmentedControl.types';
export { GameSegmentedControl } from './components/GameSegmentedControl';
export type {
	GameSegmentedControlProps,
	GameSegmentedOption,
} from './components/GameSegmentedControl/_GameSegmentedControl.types';
export { GameSelectionCard } from './components/GameSelectionCard';
export type {
	GameSelectionCardBadge,
	GameSelectionCardProps,
} from './components/GameSelectionCard/_GameSelectionCard.types';
export { QuickPlayCard } from './components/QuickPlayCard';
export type { QuickPlayCardProps } from './components/QuickPlayCard/_QuickPlayCard.types';
export { Icon } from './components/Icon';
export type { IconName, IconProps, IconSize } from './components/Icon/_Icon.types';

export { ConsentBanner } from './components/ConsentBanner';
export type { ConsentBannerProps } from './components/ConsentBanner';
export { ConsentDialog } from './components/ConsentDialog';
export type { ConsentDialogProps } from './components/ConsentDialog';

export { PrivacySettingRow } from './components/PrivacySettingRow';
export type { PrivacySettingRowProps } from './components/PrivacySettingRow';

export { useUserSession } from './hooks/useUserSession';
export type { UseUserSessionReturn } from './hooks/useUserSession';
export { useUserDataTier } from './hooks/useUserDataTier';
export type { UseUserDataTierReturn } from './hooks/useUserDataTier';

export { Toast, ToastContainer, ToastItem, toast } from './components/Toast';
export type {
	ToastAction,
	ToastContainerProps,
	ToastItemData,
	ToastItemProps,
	ToastOptions,
	ToastPosition,
	ToastVariant,
} from './components/Toast/_Toast.types';

export * from './components/MedalToastListener/index.js';

export { MedalIcon, MedalEmblem } from './components/MedalIcon';
export type {
	MedalEmblemProps,
	MedalIconProps,
	MedalState,
	MedalTier,
} from './components/MedalIcon';

export { MedalCard, TriadBadge } from './components/MedalCard';
export type {
	MedalCardMode,
	MedalCardProps,
	MedalProgressData,
	TriadBadgeProps,
} from './components/MedalCard';

export { GameMedalGrid } from './components/GameMedalGrid';
export type { GameMedalGridProps } from './components/GameMedalGrid';

export { GameStatsDashboard } from './components/GameStatsDashboard';
export type { GameStatsDashboardProps } from './components/GameStatsDashboard';

export { GameSettingsPanel } from './components/GameSettingsPanel';
export type {
	GameSettingsPanelMode,
	GameSettingsPanelProps,
} from './components/GameSettingsPanel';
export type {
	GameSettingsConfig,
	SettingControlType,
	SettingFieldDescriptor,
	SettingFieldOption,
} from '@arcade/lib-games';

export { GameHeader } from './components/GameHeader';
export type { GameHeaderProps } from './components/GameHeader';

export { BaseLayout } from './layouts/BaseLayout';
export type { BaseLayoutProps } from './layouts/BaseLayout';
export { BaseLayoutWithSiteFooter } from './layouts/BaseLayoutWithSiteFooter';
export type { BaseLayoutWithSiteFooterProps } from './layouts/BaseLayoutWithSiteFooter';
export { BaseLayoutWithSiteHeaderAndSiteFooter } from './layouts/BaseLayoutWithSiteHeaderAndSiteFooter';
export type { BaseLayoutWithSiteHeaderAndSiteFooterProps } from './layouts/BaseLayoutWithSiteHeaderAndSiteFooter';
export { GameLayout } from './layouts/GameLayout';
export type { GameLayoutProps } from './layouts/GameLayout';

export { MarkdownPageTemplate } from './templates/MarkdownPageTemplate';
export type { MarkdownPageTemplateProps } from './templates/MarkdownPageTemplate';
export { GameSubpageTemplate } from './templates/GameSubpageTemplate';
export type {
	GameSubpageActionItem,
	GameSubpageTemplateProps,
} from './templates/GameSubpageTemplate';
