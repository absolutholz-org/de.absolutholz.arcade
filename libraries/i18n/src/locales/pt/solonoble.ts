import type { SoloNobleTranslationContract } from '../../schemas/solonoble.schema.js';

export const ptSoloNoble: SoloNobleTranslationContract = {
	title: 'Resta Um',
	description: 'O nobre jogo de tabuleiro. Salte sobre pinos até sobrar apenas um.',
	layouts: {
		label: 'Tabuleiro',
		english: 'Inglês Clássico (33)',
		european: 'Europeu / Francês (37)',
		triangular: 'Triangular (15)',
		diamond: 'Diamante (41)',
		wiegleb: 'Wiegleb Alemão (45)',
	},
	variants: {
		label: 'Variante',
		classicCentral: 'Clássico Central',
		classicCentralDesc: 'Termine com exatamente 1 pino no centro.',
		clearOut: 'Limpeza Total',
		clearOutDesc: 'Elimine o máximo de pinos; vença com 1 pino em qualquer lugar.',
		customStart: 'Início Livre',
		customStartDesc: 'Escolha qualquer buraco para iniciar.',
	},
	status: {
		ready: 'Escolha o buraco inicial',
		readyInstruction: 'Clique em um buraco para remover o primeiro pino.',
		playing: 'Jogando',
		won: 'Vitória Nobre!',
		wonDesc: 'Sensacional! Você resolveu com apenas um pino restante.',
		stuck: 'Sem movimentos',
		stuckDesc: 'Nenhum salto possível. Tente novamente.',
	},
	stats: {
		pegsRemaining: 'Pinos restantes',
		movesCount: 'Movimentos',
		bestPegs: 'Melhores pinos',
		bestMoves: 'Melhores movimentos',
	},
	controls: {
		undo: 'Desfazer',
		redo: 'Refazer',
		reset: 'Reiniciar',
		newGame: 'Novo Jogo',
		backToLobby: 'Voltar ao saguão',
	},
	settings: {
		title: 'Configurações',
	},
};
