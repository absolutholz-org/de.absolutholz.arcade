import type { CommonTranslationContract } from '../../schemas/common.schema.js';

export const ptCommon = {
	app: {
		title: 'Arcade',
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
		toolbarLabel: 'Preferências',
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
		settings: 'Configurações',
		rules: 'Regras',
		breadcrumb: 'Trilha de navegação',
	},
	hub: {
		gamesTitle: 'Jogos',
	},
	settings: {
		title: 'Configurações',
		description: 'Personalize sua experiência no arcade.',
		themeSectionTitle: 'Temas',
		themeSectionDescription: 'Escolha um tema visual de cores para o arcade.',
		themes: {
			base: 'Padrão',
			christmas: 'Natal',
			easter: 'Páscoa',
			'fast-food-fun': 'Fast Food Fun',
			july4th: '4 de Julho',
			stpatricks: 'Dia de São Patrício',
			'cleveland-gridiron': 'Cleveland Gridiron',
			'buckeye-pride': 'Buckeye Pride',
			germany: 'Alemanha',
			halloween: 'Halloween',
		},
	},
} as const satisfies CommonTranslationContract;
