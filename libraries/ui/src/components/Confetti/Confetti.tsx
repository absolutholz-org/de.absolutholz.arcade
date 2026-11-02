import { useEffect, useRef } from 'react';
import { DEFAULT_CONFETTI_COLORS, DEFAULT_PARTICLE_COUNT } from './Confetti.constants';
import { confettiCanvas } from './Confetti.styles';
import type { ConfettiProps } from './Confetti.types';

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	width: number;
	height: number;
	color: string;
	rotation: number;
	rotationSpeed: number;
	tiltAngle: number;
	tiltSpeed: number;
	opacity: number;
}

function createParticle(width: number, height: number, isLeft: boolean): Particle {
	// Broad launch origins to prevent edge-clustering on wide screens
	const originX = isLeft ? Math.random() * (width * 0.3) : width * 0.7 + Math.random() * (width * 0.3);
	const originY = height * 0.65 + Math.random() * (height * 0.35);

	// Angle ranges: wider arc from steep to shallow to sweep across the full viewport
	const angleDegrees = isLeft
		? -75 + Math.random() * 55 // -75° to -20° (inward toward center & top)
		: -160 + Math.random() * 55; // -160° to -105° (inward toward center & top)

	const angleRadians = (angleDegrees * Math.PI) / 180;
	// Balanced velocity between initial rapid and ultra-slow runs
	const speed = 10 + Math.random() * 6;

	return {
		x: originX,
		y: originY,
		vx: Math.cos(angleRadians) * speed,
		vy: Math.sin(angleRadians) * speed,
		width: 7 + Math.random() * 4,
		height: 5 + Math.random() * 4,
		color: DEFAULT_CONFETTI_COLORS[Math.floor(Math.random() * DEFAULT_CONFETTI_COLORS.length)],
		rotation: Math.random() * Math.PI * 2,
		rotationSpeed: (0.016 + Math.random() * 0.032) * (Math.random() > 0.5 ? 1 : -1),
		tiltAngle: Math.random() * Math.PI * 2,
		tiltSpeed: (0.006 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1),
		opacity: 1,
	};
}

export function Confetti({ onComplete, particleCount = DEFAULT_PARTICLE_COUNT }: ConfettiProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		// Respect prefers-reduced-motion: bypass animation and trigger onComplete immediately
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			onComplete?.();
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}

		let animFrameId: number;
		let screenWidth = window.innerWidth;
		let screenHeight = window.innerHeight;

		const resizeCanvas = () => {
			const dpr = window.devicePixelRatio || 1;
			screenWidth = window.innerWidth;
			screenHeight = window.innerHeight;

			canvas.width = Math.floor(screenWidth * dpr);
			canvas.height = Math.floor(screenHeight * dpr);
			canvas.style.width = `${screenWidth}px`;
			canvas.style.height = `${screenHeight}px`;

			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		const particles: Particle[] = Array.from({ length: particleCount }, (_, index) =>
			createParticle(screenWidth, screenHeight, index % 2 === 0),
		);

		const GRAVITY = 0.13;
		const HORIZONTAL_DRAG = 0.978;
		const VERTICAL_DRAG = 0.982;

		const animate = () => {
			ctx.clearRect(0, 0, screenWidth, screenHeight);

			let activeParticles = 0;

			for (let i = 0; i < particles.length; i++) {
				const p = particles[i];
				if (p.opacity <= 0 || p.y > screenHeight + 40) {
					continue;
				}

				activeParticles++;

				// Physics update
				p.vx *= HORIZONTAL_DRAG;
				p.vy = p.vy * VERTICAL_DRAG + GRAVITY;
				p.x += p.vx;
				p.y += p.vy;

				p.rotation += p.rotationSpeed;
				p.tiltAngle += p.tiltSpeed;

				// Gradual fade when particle reaches lower boundary
				if (p.y > screenHeight * 0.85) {
					p.opacity -= 0.011;
				}

				// Render 3D tumbling paper particle
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.tiltAngle);
				// 3D tumbling rotation via horizontal cosine scale
				const scaleX = Math.cos(p.rotation);
				ctx.scale(scaleX, 1);
				ctx.globalAlpha = Math.max(0, p.opacity);
				ctx.fillStyle = p.color;
				ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
				ctx.restore();
			}

			if (activeParticles > 0) {
				animFrameId = requestAnimationFrame(animate);
			} else {
				ctx.clearRect(0, 0, screenWidth, screenHeight);
				onComplete?.();
			}
		};

		animFrameId = requestAnimationFrame(animate);

		return () => {
			if (animFrameId) {
				cancelAnimationFrame(animFrameId);
			}
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [onComplete, particleCount]);

	// biome-ignore lint/a11y/noAriaHiddenOnFocusable: Overlay celebration canvas is purely decorative and pointer-events: none
	return <canvas ref={canvasRef} className={confettiCanvas} aria-hidden="true" />;
}
