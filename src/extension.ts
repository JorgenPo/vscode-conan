// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {ConanAPI} from "./conanApi";

import * as vscode from 'vscode';
import { ConanDependenciesProvider } from './treeViewProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let conanAPI = new ConanAPI(context);

	vscode.window.registerTreeDataProvider(
		"conanDependencies", 
		new ConanDependenciesProvider(vscode.workspace.rootPath));
}

// this method is called when your extension is deactivated
export function deactivate() {}
