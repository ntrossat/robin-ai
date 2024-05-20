import * as vscode from 'vscode';
import { ingestFiles } from './helpers/ingestion';
import { inlineCompletionProvider } from './helpers/code-completion';


export async function activate(context: vscode.ExtensionContext) {
  
	// Ingest files on startup
  // await ingestFiles();
	
	// Send Inline Completion Provider
	context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, inlineCompletionProvider));
}

export function deactivate() { }