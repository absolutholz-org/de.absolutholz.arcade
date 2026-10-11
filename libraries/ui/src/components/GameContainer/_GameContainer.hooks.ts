export interface UseGameContainerParams {
	id?: string;
}

export function useGameContainer({ id = 'main-content' }: UseGameContainerParams = {}) {
	return {
		resolvedId: id,
	};
}
