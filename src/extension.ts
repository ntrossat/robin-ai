import * as vscode from 'vscode';

type ApiResponse = { response: string };


export function activate(context: vscode.ExtensionContext) {
	const provider = {
        provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken) => {
            
			// Wait & see before requesting the AI...
			await new Promise(resolve => setTimeout(resolve, 1000));
			if (token.isCancellationRequested) {
				return;
			}

			// Define empty result
			const result: vscode.InlineCompletionList = {
				items: [],
			};
			
			try {
				const prompt = document.getText()
				const response = await fetch('http://localhost:11434/api/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						model: "llama3", 
						prompt: prompt,
						stream: false
					}),
				});
				
				const json = await response.json() as ApiResponse;
				const prediction = json.response;

				const completionRange = new vscode.Range(position, position.translate(0, prediction.length));
				result.items.push({
					insertText: prediction,
					range: completionRange
				});

			} catch (err) {
				console.error('Error while calling AI API:', err);
			}

			return result;
        }
    };


	context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider));
}

export function deactivate() { }