import {
	isHapticsEnabled,
	isSoundEnabled,
	playDrop,
	playMedalChime,
	playPickup,
	playProgress,
	playRegression,
	playTap,
	playVictoryFanfare,
	setHapticsEnabled,
	setSoundEnabled,
	triggerHaptic,
} from '@arcade/lib-audio';
import type React from 'react';
import { useState } from 'react';
import { Button } from '../../../components/Button';
import { Switch } from '../../../components/Switch';
import { Theme } from '../../../components/Theme';
import { themesetBaseProps } from '../themeset-base.css';
import * as styles from './AudioHapticsShowcase.css';

export function AudioHapticsShowcase() {
	const [soundOn, setSoundOn] = useState(isSoundEnabled());
	const [hapticsOn, setHapticsOn] = useState(isHapticsEnabled());
	const [progressStep, setProgressStep] = useState(0);

	const hasVibrate = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

	const handleSoundToggle = (enabled: boolean) => {
		setSoundOn(enabled);
		setSoundEnabled(enabled);
		if (enabled) {
			playTap();
		}
	};

	const handleHapticsToggle = (enabled: boolean) => {
		setHapticsOn(enabled);
		setHapticsEnabled(enabled);
		if (enabled) {
			triggerHaptic('light');
		}
	};

	const handleProgressStep = () => {
		playProgress(progressStep);
		setProgressStep((prev) => (prev + 1) % 10);
	};

	return (
		<div className={styles.showcaseContainer} style={themesetBaseProps as React.CSSProperties}>
			<Theme name="primary">
				{/* Global Controls Card */}
				<div className={styles.showcaseCard}>
					<div className={styles.cardHeader}>
						<div>
							<h3 className={styles.cardTitle}>Live Audio & Haptic Gates</h3>
							<p className={styles.cardDescription}>
								Toggle reactive states to test early-exit gate logic without node creation.
							</p>
						</div>
					</div>
					<div className={styles.buttonGrid}>
						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Sound Effects</p>
							<p className={styles.actionDescription}>Master sound toggle for all audio primitives.</p>
							<Switch
								id="showcase-sound-switch"
								aria-label="Sound Effects Master Toggle"
								checked={soundOn}
								onChange={(e) => handleSoundToggle(e.target.checked)}
							/>
						</div>
						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Haptic Feedback</p>
							<p className={styles.actionDescription}>Master haptics toggle for device vibrations.</p>
							<Switch
								id="showcase-haptics-switch"
								aria-label="Haptic Feedback Master Toggle"
								checked={hapticsOn}
								onChange={(e) => handleHapticsToggle(e.target.checked)}
							/>
						</div>
					</div>
				</div>

				{/* Sound Primitives Card */}
				<div className={styles.showcaseCard}>
					<div className={styles.cardHeader}>
						<div>
							<h3 className={styles.cardTitle}>Synthesized Zero-Asset Sound Primitives</h3>
							<p className={styles.cardDescription}>
								Synthesized using native Web Audio API oscillators and gain envelopes with zero audio
								files.
							</p>
						</div>
					</div>

					<div className={styles.buttonGrid}>
						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Tap Chirp</p>
							<p className={styles.actionDescription}>40ms sine chirp for micro-interactions.</p>
							<Button variant="secondary" size="sm" type="button" onClick={() => playTap()}>
								Play playTap()
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Pickup Glide</p>
							<p className={styles.actionDescription}>30ms upward pitch glide on tile lift.</p>
							<Button variant="secondary" size="sm" type="button" onClick={() => playPickup()}>
								Play playPickup()
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Drop Snap</p>
							<p className={styles.actionDescription}>50ms percussive downward snap on placement.</p>
							<Button variant="secondary" size="sm" type="button" onClick={() => playDrop()}>
								Play playDrop()
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Pentatonic Progress</p>
							<p className={styles.actionDescription}>
								Ascending notes along major pentatonic scale (Step {progressStep}).
							</p>
							<div className={styles.stepperRow}>
								<Button variant="primary" size="sm" type="button" onClick={handleProgressStep}>
									Play Note {progressStep}
								</Button>
								<Button variant="outline" size="sm" type="button" onClick={() => setProgressStep(0)}>
									Reset
								</Button>
							</div>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Regression Thud</p>
							<p className={styles.actionDescription}>Muted 80ms low thud for invalid actions.</p>
							<Button variant="secondary" size="sm" type="button" onClick={() => playRegression()}>
								Play playRegression()
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Victory Fanfare</p>
							<p className={styles.actionDescription}>Arpeggiated 4-note ascending triumph chord.</p>
							<Button variant="primary" size="sm" type="button" onClick={() => playVictoryFanfare()}>
								Play playVictoryFanfare()
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Medal Chime</p>
							<p className={styles.actionDescription}>Bright two-tone resonant harmonic shimmer.</p>
							<Button variant="primary" size="sm" type="button" onClick={() => playMedalChime()}>
								Play playMedalChime()
							</Button>
						</div>
					</div>
				</div>

				{/* Haptic Patterns Card */}
				<div className={styles.showcaseCard}>
					<div className={styles.cardHeader}>
						<div>
							<h3 className={styles.cardTitle}>Haptic Feedback Patterns</h3>
							<p className={styles.cardDescription}>
								Dispatched via navigator.vibrate on supported mobile touch devices.
							</p>
						</div>
						<span className={styles.statusNotice}>
							{hasVibrate
								? '✓ navigator.vibrate supported'
								: 'ℹ Vibration unsupported on this browser/OS'}
						</span>
					</div>

					<div className={styles.buttonGrid}>
						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Light (12ms)</p>
							<p className={styles.actionDescription}>Subtle tactile click for keystrokes & taps.</p>
							<Button variant="secondary" size="sm" type="button" onClick={() => triggerHaptic('light')}>
								Trigger Light
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Medium (22ms)</p>
							<p className={styles.actionDescription}>Firm tactile pulse for drag drops and locks.</p>
							<Button variant="secondary" size="sm" type="button" onClick={() => triggerHaptic('medium')}>
								Trigger Medium
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Success Pattern</p>
							<p className={styles.actionDescription}>Rhythmic sequence [30, 40, 50, 40, 80]ms.</p>
							<Button variant="primary" size="sm" type="button" onClick={() => triggerHaptic('success')}>
								Trigger Success
							</Button>
						</div>

						<div className={styles.actionBox}>
							<p className={styles.actionTitle}>Warning Pattern</p>
							<p className={styles.actionDescription}>Triple buzz pattern [40, 60, 40]ms.</p>
							<Button variant="outline" size="sm" type="button" onClick={() => triggerHaptic('warning')}>
								Trigger Warning
							</Button>
						</div>
					</div>
				</div>
			</Theme>
		</div>
	);
}
