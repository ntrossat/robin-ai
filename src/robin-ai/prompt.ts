import * as vscode from 'vscode';
import * as fs from 'fs/promises';

// export async function getContext() {

//   // Get open tabs
//   let context: string = "";

//   const openDocumentsUri = vscode.window.tabGroups.all.flatMap(({ tabs }) => tabs.map(tab => {
//     if (tab.input instanceof vscode.TabInputText || tab.input instanceof vscode.TabInputNotebook) {
//         return tab.input.uri.path;
//     }
//   }));

//   for (const uri of openDocumentsUri) {
//     context += '<|file_separator|>';
//     context += await fs.promises.readFile(uri!, 'utf8');
//   }

//   return context;
// };

export async function getContext() {
  // Get open documents with content efficiently
  const openDocuments: { uri: string; content: string }[] = [];
  for (const tabGroup of vscode.window.tabGroups.all) {
    for (const tab of tabGroup.tabs) {
      if (tab.input instanceof vscode.TabInputText || tab.input instanceof vscode.TabInputNotebook) {
        const uri = tab.input.uri.path;
        const content = await readFileIfSupported(uri);
        if (content) {
          openDocuments.push({ uri, content });
        }
      }
    }
  }

  // Combine content with separators
  return openDocuments.reduce((context, { content }) => context + content + '<|file_separator|>\n', '');
}

async function readFileIfSupported(uri: string): Promise<string | undefined> {
  try {
    return await fs.readFile(uri, 'utf8');
  } catch (error) {
    // Handle potential errors gracefully (e.g., log, display notification)
    console.error(`Error reading file ${uri}:`, error);
    return undefined;
  }
}