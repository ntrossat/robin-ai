import * as vscode from 'vscode';
import * as fs from 'fs';

export async function ingestFiles() {


  // Load document from Workspace
  // const files = await vscode.workspace.findFiles('**/*.py');
  // let text: string = "";
  // for (const uri of files) {
  //   try {
  //     const content = await fs.promises.readFile(uri.fsPath, 'utf8');

  //     text += content;
  //     text += "\\n";
  //   } catch (error) {
  //     console.error(`Error reading file: ${uri.fsPath}`, error);
  //   }
  // }
  
  console.log("INGESTION");

  const openDocumentUris = vscode.window.tabGroups.all.flatMap(({ tabs }) => tabs.map(tab => {
    if (tab.input instanceof vscode.TabInputText || tab.input instanceof vscode.TabInputNotebook) {
        return tab.input.uri.path;
    }
  }));

  let content: string = "";
  for (const uri of openDocumentUris) {
    content += await fs.promises.readFile(uri!, 'utf8');
  }

  const response = await fetch("http://localhost:8080/ingest", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      content: content
    })
  });

  vscode.window.showInformationMessage('INGESTION');
  return "test";
};