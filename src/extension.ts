import * as vscode from 'vscode';
import { inlineCompletionProvider } from './robin-ai/code-completion';


export async function activate(context: vscode.ExtensionContext) {
  
	// Send RobinAI Inline Completion Provider
	context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, inlineCompletionProvider));
}

export function deactivate() { }