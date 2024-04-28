import OpenAI from 'openai';
import {
	ChatCompletionChunk,
	ChatCompletionMessage,
	ChatCompletionMessageParam,
} from 'openai/resources/chat';
import { ReadStream } from 'fs';
import { Stream } from 'openai/streaming';

export interface ExtendedChatCompletionMessage extends ChatCompletionMessage {
	error?: boolean;
	content: string;
}

export class OpenaiService {
	openai: OpenAI;

	constructor(key: string) {
		this.openai = new OpenAI({
			apiKey: key,
			dangerouslyAllowBrowser: true,
		});
	}

	async response(messages: ChatCompletionMessageParam[]): Promise<ExtendedChatCompletionMessage> {
		try {
			const completion = await this.openai.chat.completions.create({
				messages: messages,
				model: 'gpt-4-0125-preview',
				temperature: 0.5,
			});
			if (!completion.choices[0]?.message) {
				throw new Error('openai.chat.completions is undefined');
			}
			const content = completion.choices[0]?.message.content;
			const role = completion.choices[0]?.message.role;
			if (content === null) {
				throw new Error('message.content is null');
			}
			return {
				role: role,
				content: content,
				error: false,
			};
		} catch (error) {
			if (error instanceof OpenAI.APIError) {
				const { status, message, code, type } = error;
				const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
				console.error(errorMessage);
				return {
					role: 'assistant',
					content: errorMessage,
					error: true,
				};
			} else {
				return {
					role: 'assistant',
					content: `Non-API error, ${error}`,
					error: true,
				};
			}
		}
	}

	async streamResponse(
		messages: ChatCompletionMessageParam[],
	): Promise<Stream<ChatCompletionChunk> | ExtendedChatCompletionMessage> {
		try {
			const stream = await this.openai.chat.completions.create({
				model: 'gpt-3.5-turbo-16k',
				messages: messages,
				stream: true,
			});
			return stream;
		} catch (error) {
			if (error instanceof OpenAI.APIError) {
				const { status, message, code, type } = error;
				const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
				console.error(errorMessage);
				return {
					role: 'assistant',
					content: errorMessage,
					error: true,
				};
			} else {
				return {
					role: 'assistant',
					content: `Non-API error, ${error}`,
					error: true,
				};
			}
		}
	}

	async transcriptionAudio(audioStream: ReadStream): Promise<ExtendedChatCompletionMessage> {
		try {
			const response = await this.openai.audio.transcriptions.create({
				model: 'whisper-1',
				file: audioStream,
			});
			return {
				role: 'assistant',
				content: response.text,
			};
		} catch (error) {
			if (error instanceof OpenAI.APIError) {
				const { status, message, code, type } = error;
				const errorMessage = `status: ${status} message: ${message} code: ${code} type: ${type}`;
				console.error(errorMessage);
				return {
					role: 'assistant',
					content: errorMessage,
					error: true,
				};
			} else {
				return {
					role: 'assistant',
					content: `Non-API error, ${error}`,
					error: true,
				};
			}
		}
	}

	createUserMessage(message: string): ChatCompletionMessageParam {
		return {
			role: 'user',
			content: message,
		};
	}

	createAssistantMessage(message: string): ChatCompletionMessageParam {
		return {
			role: 'assistant',
			content: message,
		};
	}
}
