import { Logger, ILogObj } from 'tslog';

export class LoggerService {
	private logger: Logger<ILogObj>;

	constructor(name?: string) {
		this.logger = new Logger({
			hideLogPositionForProduction: true,
			type: 'pretty',
			name: name,
		});
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}

	info(...args: unknown[]): void {
		this.logger.info(...args);
	}

	trace(...args: unknown[]): void {
		this.logger.trace(...args);
	}
}
