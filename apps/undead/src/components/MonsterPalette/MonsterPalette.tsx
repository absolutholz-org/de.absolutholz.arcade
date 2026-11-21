import { useI18n } from '@arcade/lib-i18n/hooks/useI18n';
import type { JSX } from 'react';
import { MONSTER_TYPES, type MonsterCounts, type MonsterType } from '../../engine/types';
import { MonsterIcon } from '../MonsterIcon/MonsterIcon';
import * as S from './MonsterPalette.styles';

const MONSTER_SHORTCUT: Readonly<Record<MonsterType, string>> = {
	ghost: 'G',
	vampire: 'V',
	zombie: 'Z',
};

export interface MonsterPaletteProps {
	readonly inventory: MonsterCounts;
	readonly placedCounts: MonsterCounts;
	readonly overLimit: Readonly<Record<MonsterType, boolean>>;
	readonly selectedMonster: MonsterType;
	readonly isNotesMode: boolean;
	readonly disabled: boolean;
	readonly onMonsterPress: (monster: MonsterType) => void;
	readonly onToggleNotes: () => void;
	readonly onErase: () => void;
}

export function MonsterPalette({
	inventory,
	placedCounts,
	overLimit,
	selectedMonster,
	isNotesMode,
	disabled,
	onMonsterPress,
	onToggleNotes,
	onErase,
}: MonsterPaletteProps): JSX.Element {
	const { t } = useI18n('undead');

	return (
		<S.PaletteContainer>
			<S.PaletteRow role="toolbar" aria-label={t('aria.paletteToolbar')}>
				{MONSTER_TYPES.map((monster) => {
					const placed = placedCounts[monster];
					const total = inventory[monster];
					const isOver = overLimit[monster];
					const isSatisfied = placed === total && !isOver;
					const label = t(`monsters.${monster}`);
					const keyHint = MONSTER_SHORTCUT[monster];
					const ariaParts = [
						t('aria.paletteMonster', {
							monster: label,
							key: keyHint,
							placed,
							total,
						}),
					];
					if (isOver) {
						ariaParts.push(t('aria.paletteOverLimit'));
					}

					return (
						<S.MonsterButton
							key={monster}
							type="button"
							data-monster={monster}
							data-selected={selectedMonster === monster}
							data-satisfied={isSatisfied}
							data-over-limit={isOver}
							aria-pressed={selectedMonster === monster}
							aria-label={ariaParts.join(', ')}
							disabled={disabled}
							onClick={() => onMonsterPress(monster)}
						>
							<S.IconSlot>
								<MonsterIcon monster={monster} />
							</S.IconSlot>
							<S.MonsterMeta>
								<S.MonsterName>{label}</S.MonsterName>
								<S.CountRow data-over-limit={isOver}>
									<span>
										{placed}/{total}
									</span>
									{isOver && <span aria-hidden="true">⚠</span>}
								</S.CountRow>
							</S.MonsterMeta>
							<S.KeyBadge aria-hidden="true">{keyHint}</S.KeyBadge>
						</S.MonsterButton>
					);
				})}

				<S.ActionGroup>
					<S.ModeButton
						type="button"
						data-active={isNotesMode}
						aria-pressed={isNotesMode}
						aria-label={isNotesMode ? t('controls.notesOn') : t('controls.notesOff')}
						disabled={disabled}
						onClick={onToggleNotes}
					>
						<span aria-hidden="true">✎</span>
						<span>{t('controls.notes')}</span>
					</S.ModeButton>

					<S.ModeButton type="button" aria-label={t('controls.erase')} disabled={disabled} onClick={onErase}>
						<span aria-hidden="true">⌫</span>
						<span>{t('controls.erase')}</span>
					</S.ModeButton>
				</S.ActionGroup>
			</S.PaletteRow>

			<S.ShortcutHint>{t('controls.shortcutHint')}</S.ShortcutHint>
		</S.PaletteContainer>
	);
}
