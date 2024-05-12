import * as vscode from 'vscode';

type ApiResponse = { response: string };

export function activate(context: vscode.ExtensionContext) {
	const provider = {
        provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken) => {

			// Define empty result
			const result: vscode.InlineCompletionList = {
				items: [],
			};

			// Call Ollama API
			try {
				// Logging Start
				const startTime = performance.now();
        		console.log('REQUEST');
				
				// Prompt
				const prefix = document.getText(
					new vscode.Range(
						new vscode.Position(0, 0), 
						position
					)
				)
				const suffix= document.getText(
					new vscode.Range(
						position, 
						new vscode.Position(document.lineCount, 0)
					)
				)
				const prompt = `<|fim_prefix|>${prefix}<|fim_suffix|>${suffix}<|fim_middle|>`

				// Request
				const response = await fetch('http://localhost:11434/api/generate', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						model: "codegemma:code", 
						prompt: prompt,
						options: {
							"stop": ["\n\n", "<|file_separator|>"],
							"temperature": 0,
							"repeat_penalty": 1.2,
							"num_predict": 64,
							"top_k": 20,
							"top_p": 0.9,
                            "seed": 42,
						},
						stream: false
					})
				});
				const json_response = await response.json() as ApiResponse;
				const prediction = json_response.response.replace(/\\n/g, "\n");
				
				// Logging End
				const endTime = performance.now();
				console.log('PREDICTION:', prediction);
				console.log(`PREDICTION time: ${(endTime - startTime)} ms`);

				// Send AI prediction
				const completionRange = new vscode.Range(position, position.translate(0, prediction.length));
				result.items.push({
					insertText: prediction,
					range: completionRange
				});

			} catch (err) {
				// Show Error Message
				vscode.window.showErrorMessage(`Error while calling Robin AI API: ${err}`);
			}

			return result;
        }
    };

	context.subscriptions.push(vscode.languages.registerInlineCompletionItemProvider({ pattern: '**' }, provider));
}

export function deactivate() { }