import * as vscode from 'vscode';

export function getApiUrl() {
  const DEFAULT_API_URL = "http://localhost:11434/api/generate";
  const apiUrlSetting: string | undefined = vscode.workspace.getConfiguration().get('OllamaApi');

  if (apiUrlSetting) {
    return apiUrlSetting;
  }
  return DEFAULT_API_URL;
};
