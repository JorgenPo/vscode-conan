// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ConanDependenciesProvider } from './treeViewProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider(
		"conanDependencies", 
		new ConanDependenciesProvider(vscode.workspace.rootPath));

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vs-conan.about', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Vs-Conan extension for conan support 2020(c) George Popoff');

		setTimeout(() => {
			vscode.window.showWarningMessage("Something not really OK!");
		}, 2000);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
