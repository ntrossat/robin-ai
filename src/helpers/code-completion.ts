import * as vscode from 'vscode';
import ollama from 'ollama';

import { getApiUrl } from './config';

type ApiResponse = { response: string };

export const inlineCompletionProvider = {
  provideInlineCompletionItems: async (document: vscode.TextDocument, position: vscode.Position, context: vscode.InlineCompletionContext, token: vscode.CancellationToken) => {
    vscode.window.showInformationMessage('Request received...');

    // Define empty result
    const result: vscode.InlineCompletionList = {
      items: [],
    }; 

    // Call Ollama API
    try {
      // Logging Start
      const startTime = performance.now();			
      	

      console.log('REQUEST START');

      
      // Prompt
      const prefix = document.getText(
        new vscode.Range(

          new vscode.Position(0, 0), 

          position
        )
      );
      const suffix= document.getText(
        new vscode.Range(
          position, 
          new vscode.Position(document.lineCount, 0)
        )
      );
      const prompt = `<|fim_prefix|>${prefix}<|fim_suffix|>${suffix}<|fim_middle|>`;

      // Request
      
      const response = await ollama.generate({ 
        model: "codegemma:code", 
        prompt: prompt,
        options: {
          "stop": ["\n\n", "<|file_separator|>"],
          "temperature": 0,
          "repeat_penalty": 1.2,
          "num_predict": 1024, 		// Max tokens to generate (256) - default is max length of model + prompt length (1024)
          "top_k": 20,
          "top_p": 0.9,
          "seed": 42,
        },
        stream: false
      });
      const completion = response.response;
      console.log(completion);

      // Logging End
      const endTime = performance.now();
      const completionTime = Math.round((endTime - startTime))/1000;
      vscode.window.showInformationMessage(`Completion: ${completion}`);
      vscode.window.showInformationMessage(`Elapsed time ${completionTime} s`);

      // Send AI completion
      const completionRange = new vscode.Range(position, position.translate(0, completion.length));
      result.items.push({
        insertText: completion,
        range: completionRange
      });

    } catch (err) {
      // Show Error Message
      console.log(err); 		// Logging Error
      vscode.window.showErrorMessage(`Error while calling Robin AI API: ${err}`);
    }

    return result;
  }
};