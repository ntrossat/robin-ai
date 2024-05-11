import * as vscode from 'vscode';

type ApiResponse = { response: string };


export function activate(context: vscode.ExtensionContext) {
	const provider = {
        provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken) => {
            
			// Wait & see before requesting the AI...
			await new Promise(resolve => setTimeout(resolve, 500));
			if (token.isCancellationRequested) {
				return;
			}

			// Define empty result
			const result: vscode.InlineCompletionList = {
				items: [],
			};
			
			try {
				const startTime = performance.now();
				console.log("REQUEST")

				const prefixRange = new vscode.Range(new vscode.Position(0, 0), position)
				const prefix = document.getText(prefixRange)
				const suffixRange = new vscode.Range(position, new vscode.Position(document.lineCount, 0), )
				const suffix = document.getText(suffixRange)

				const prompt = `<|fim_prefix|>${prefix}<|fim_suffix|>${suffix}<|fim_middle|>`
				const response = await fetch('http://localhost:11434/api/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						model: "codegemma:code", 
						prompt: prompt,
						stream: false
					}),
				});

				const json = await response.json() as ApiResponse;
				const prediction = json.response;

				const endTime = performance.now();
				console.log('PREDICTION:', prediction);
				console.log(`Elapsed time: ${(endTime - startTime)} ms`);

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