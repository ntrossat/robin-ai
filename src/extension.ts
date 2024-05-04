import * as vscode from 'vscode';

type ApiResponse = { response: string };


export function activate(context: vscode.ExtensionContext) {
	const provider = {
        provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken) => {
            
			if (position.line <= 0) {
				return;
			}

			const result: vscode.InlineCompletionList = {
				items: [],
			};

			try {
				const response = await fetch('http://localhost:11434/api/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						model: "llama3", 
						prompt: document.getText(new vscode.Range(new vscode.Position(0, 0), position)),
						stream: false
					}),
				});
			 
				const json = await response.json() as ApiResponse;
				const AIResponse = json.response;

				const completionRange = new vscode.Range(position, position.translate(0, AIResponse.length));
				result.items.push({
					insertText: AIResponse,
					range: completionRange
				});

				return result;
			} catch (err) {
				console.error('Error while calling AI API:', err);
			}

			return;
        }
    };


	context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider));
}

export function deactivate() { }