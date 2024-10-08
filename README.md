# Robin AI - Inline Code Completion Extension

**Robin AI is an Open-Source, AI-driven, Inline Code Completion extension for VScode, powered by Ollama and CodeGen.**

It runs locally on your machine, offering privacy and no need for an internet connection.

![Code Completion Example](src/images/code-completion-example.png)

## Installation

**Before you begin, you'll need to install Ollama on your computer.** Ollama allows you to run [CodeGemma](https://ai.google.dev/gemma/docs/codegemma), the AI model that powers Robin AI.

### 1 - Install Ollama

Download and run [Ollama](https://ollama.com/download)

### 2- Pull codegemma:code model

`ollama pull codegemma:code`

### 3 - Test Ollama

`ollama run codegemma:code`

### 4 - Install Robin AI .vsix Extension

Dowload the latest [Robin AI extension](https://github.com/ntrossat/robin-ai/blob/main/robin-ai-0.1.0.vsix) from [Robin AI](https://github/ntrossat/robin-ai) Github Repo.

On VSCode, select the Extensions tab, click on the three dots, and select "Install from VSIX..."

![Install from VSIX](src/images/install-from-vsix.png)

## Usage

Just type your code, and Robin AI will propose relevant code completions. Select the desired completion to accept it or hit "Tab".

The context for code completion in VS Code is based on your open files. The more open files you have, the more relevant completion suggestions you'll see. However, having too many open files can slow down the completion process.

Adding comments to your code can improve the accuracy of Robin AI's suggestions, as comments provide additional context about your code's functionality.

## Limitations

Robin AI is for educational purposes.

### Update VSCode Extension

`npm run vscode:package`
