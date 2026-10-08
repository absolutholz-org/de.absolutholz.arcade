import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const ptCommon = {
	app: {
		title: 'Arcade Web App',
		tagline: 'Jogos clássicos construídos com foco em acessibilidade.',
		redirectNotice: 'Redirecionando para seu idioma preferido...',
	},
	switchers: {
		language: {
			ariaLabel: 'Selecionar idioma',
		},
		scheme: {
			ariaLabel: 'Esquema de cores',
			options: {
				light: 'Claro',
				dark: 'Escuro',
				system: 'Sistema',
			},
		},
	},
	actions: {
		close: 'Fechar',
		save: 'Salvar',
		back: 'Voltar',
	},
	navigation: {
		home: 'Início',
		privacy: 'Privacidade',
		imprint: 'Informações Legais',
		accessibility: 'Acessibilidade',
		skipToContent: 'Pular para o conteúdo principal',
		legal: 'Informações legais',
	},
	hub: {
		gamesTitle: 'Jogos',
	},
} as const satisfies CommonTranslationContract;
