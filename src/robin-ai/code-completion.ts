import * as vscode from 'vscode';

import { getApiUrl } from './config';
import { getContext } from './prompt';

type ApiResponse = { response: string };

export const inlineCompletionProvider = {
  provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken) => {

    // Define an empty result
    const result: vscode.InlineCompletionList = {
      items: [],
    }; 

    // Call Ollama API
    try {

      // Logging Start
      const startTime = performance.now();

      // Set context
      const context = await getContext();
      
      // Set prefix
      const prefix = document.getText(
        new vscode.Range(new vscode.Position(0, 0), position)
      );

      // Set suffix
      const suffix= document.getText(
        new vscode.Range(position, new vscode.Position(document.lineCount, 0))
      );

      // Set prompt
      const prompt = `${context}<|fim_prefix|>${prefix}<|fim_suffix|>${suffix}<|fim_middle|>`;
      console.log(prompt);
      
      // Request
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model: "codegemma:code", 
          prompt: prompt,
          options: {
            "stop": ["\n\n", "${suffix}", "<|file_separator|>"],
            "temperature": 0.5,
            "repeat_penalty": 1.2,
            "num_predict": 256,
            "top_k": 20,
            "top_p": 0.9,
            "seed": 42,
          },
          stream: false
        })
      });
      const json_response = await response.json() as ApiResponse;
      const completion = json_response.response.replace(/\\n/g, "\n");

      // Logging End - Uncomment for debugging purposes
      const endTime = performance.now();
      const completionTime = Math.round((endTime - startTime))/1000;
      // vscode.window.showInformationMessage(`Completion: ${completion}`);
      // vscode.window.showInformationMessage(`Elapsed time ${completionTime} s`);

      // Send RobinAI completion
      const completionRange = new vscode.Range(position, position.translate(0, completion.length));
      result.items.push({
        insertText: completion,
        range: completionRange
      });

    } catch (err) {
      // Show Error Message
      vscode.window.showErrorMessage(`Error while calling Robin AI API: ${err}`);
    }

    return result;
  }
};