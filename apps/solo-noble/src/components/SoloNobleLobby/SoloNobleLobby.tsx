import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import { I18nProvider } from '@arcade/lib-i18n/provider/I18nProvider';
import type { SupportedLanguageCode } from '@arcade/lib-i18n/types/i18n.types.js';
import { GameSelectionCard } from '@arcade/lib-ui/components/GameSelectionCard';
import { SegmentedControl, type SegmentedControlItem } from '@arcade/lib-ui/components/SegmentedControl';
import { formatTime } from '@arcade/lib-ui/components/Timer';
import { GameLandingTemplate } from '@arcade/lib-ui/layouts/GameLandingTemplate/index.js';
import { useEffect, useState } from 'react';
import type { BoardLayoutId, GameVariant } from '../../engine/types.js';
import {
	type ActiveGameSnapshot,
	type BestRecord,
	loadActiveGame,
	loadPreferences,
	loadRecords,
	savePreferences,
} from '../../storage/storage.js';
import { SoloNobleBoardPreview } from '../SoloNobleBoardPreview/SoloNobleBoardPreview.js';
import * as S from './SoloNobleLobby.styles.js';

const LAYOUT_TABS: { id: BoardLayoutId; holes: number }[] = [
	{ id: 'english', holes: 33 },
	{ id: 'european', holes: 37 },
	{ id: 'triangular', holes: 15 },
	{ id: 'diamond', holes: 41 },
	{ id: 'wiegleb', holes: 45 },
];

const VARIANTS: { id: GameVariant }[] = [{ id: 'classic-central' }, { id: 'clear-out' }, { id: 'custom-start' }];

function LobbyContent() {
	const { t, language } = useI18n('solo-noble');
	const { t: tCommon } = useI18n('common');

	const [activeLayout, setActiveLayout] = useState<BoardLayoutId>(() => {
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search);
			const paramLayout = params.get('layout') as BoardLayoutId | null;
			if (paramLayout && LAYOUT_TABS.some((tab) => tab.id === paramLayout)) {
				return paramLayout;
			}
		}
		return 'english';
	});

	const [activeGame, setActiveGame] = useState<ActiveGameSnapshot | null>(null);
	const [records, setRecords] = useState<Record<string, BestRecord>>({});

	useEffect(() => {
		async function init() {
			const savedGame = await loadActiveGame();
			if (savedGame && savedGame.status === 'playing') {
				setActiveGame(savedGame);
			}
			const savedRecords = await loadRecords();
			setRecords(savedRecords);

			if (typeof window !== 'undefined') {
				const params = new URLSearchParams(window.location.search);
				const paramLayout = params.get('layout') as BoardLayoutId | null;
				if (paramLayout && LAYOUT_TABS.some((tab) => tab.id === paramLayout)) {
					return;
				}
			}

			const prefs = await loadPreferences();
			if (prefs.layoutId) {
				setActiveLayout(prefs.layoutId);
			}
		}
		init();
	}, []);

	const handleSelectLayout = (layoutId: string) => {
		const nextLayout = layoutId as BoardLayoutId;
		setActiveLayout(nextLayout);
		savePreferences({ layoutId: nextLayout, variant: 'classic-central' });
		if (typeof window !== 'undefined') {
			const url = new URL(window.location.href);
			url.searchParams.set('layout', nextLayout);
			window.history.replaceState(null, '', url.toString());
		}
	};

	const layoutItems: SegmentedControlItem[] = LAYOUT_TABS.map((tab) => ({
		id: tab.id,
		label: t(`layouts.${tab.id}`),
	}));

	const currentTabConfig = LAYOUT_TABS.find((tab) => tab.id === activeLayout) ?? LAYOUT_TABS[0];

	const resumeState = activeGame
		? {
				message: `${t(`layouts.${activeGame.layoutId}`)} • ${activeGame.pegsRemaining} pegs left • ${formatTime(activeGame.elapsedSeconds)}`,
				onResume: () => {
					window.location.href = `/solo-noble/${language}/game?resume=true`;
				},
				buttonLabel: tCommon('controls.resume', { defaultValue: 'Resume' }),
			}
		: undefined;

	return (
		<GameLandingTemplate
			title={t('title')}
			description={t('description')}
			resumeState={resumeState}
			offlineGameId="solo-noble"
		>
			<SegmentedControl
				items={layoutItems}
				value={activeLayout}
				onChange={handleSelectLayout}
				ariaLabel={t('layouts.label')}
			/>

			<S.PuzzlesSection>
				<h2>{t('variants.label')}</h2>
				<S.VariantsGrid>
					{VARIANTS.map((v) => {
						const recordKey = `${activeLayout}_${v.id}`;
						const best = records[recordKey];

						let subtitle: string | undefined;
						if (best) {
							subtitle = best.won
								? `🏆 Solved in ${best.moves} moves`
								: `Best: ${best.minPegs} pegs left`;
						}

						const variantTitle = t(
							v.id === 'classic-central'
								? 'variants.classicCentral'
								: v.id === 'clear-out'
									? 'variants.clearOut'
									: 'variants.customStart',
						);

						const variantDesc = t(
							v.id === 'classic-central'
								? 'variants.classicCentralDesc'
								: v.id === 'clear-out'
									? 'variants.clearOutDesc'
									: 'variants.customStartDesc',
						);

						return (
							<GameSelectionCard
								key={`${activeLayout}-${v.id}`}
								as="a"
								href={`/solo-noble/${language}/game?layout=${activeLayout}&variant=${v.id}&new=true`}
								data-astro-prefetch
								title={variantTitle}
								dimensions={`${currentTabConfig.holes} ${t('stats.pegsRemaining')}`}
								description={variantDesc}
								subtitle={subtitle}
								preview={<SoloNobleBoardPreview layoutId={activeLayout} variant={v.id} />}
								badge={best?.won ? { label: 'Solved', variant: 'success' } : undefined}
							/>
						);
					})}
				</S.VariantsGrid>
			</S.PuzzlesSection>
		</GameLandingTemplate>
	);
}

export function SoloNobleLobby({ lang }: { lang: SupportedLanguageCode }) {
	return (
		<I18nProvider language={lang}>
			<LobbyContent />
		</I18nProvider>
	);
}
