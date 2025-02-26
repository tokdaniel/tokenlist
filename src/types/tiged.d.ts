declare module "tiged" {
	interface TigedOptions {
		mode?: "git" | "tar";
		cache?: boolean;
		verbose?: boolean;
		force?: boolean;
	}

	interface TigedEmitter {
		clone(targetDir: string): Promise<void>;
	}

	export function tiged(repo: string, options?: TigedOptions): TigedEmitter;
}
