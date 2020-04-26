import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as conan from "./conanParser";

export class ConanDependenciesProvider implements vscode.TreeDataProvider<ConanDependency> {
    constructor(private workspaceRoot?: string) {}

    getTreeItem(element: ConanDependency): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: ConanDependency | undefined): vscode.ProviderResult<ConanDependency[]> {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage("Vs-Conan: no dependencies");
            return Promise.resolve([]);
        }

        if (element) {
            vscode.window.showWarningMessage("Dependencies of dependencies are not implemented yet!");
            return Promise.resolve([]);
        }

        const conanfileTxtPath = path.join(this.workspaceRoot, "conanfile.txt");
        const conanfilePyPath = path.join(this.workspaceRoot, "conanfile.py");
        let conanfilePath = "";
        let extension = "";

        if (this.pathExists(conanfileTxtPath)) {
            vscode.window.showInformationMessage("Parsing conanfile.txt");
            conanfilePath = conanfileTxtPath;
            extension = "txt";
        } else if (this.pathExists(conanfilePyPath)) {
            vscode.window.showInformationMessage("Parsing conanfile.py");
            conanfilePath = conanfilePyPath;
            extension = "py";
        }

        try {
            const dependencies = this.getDepsInConanfile(conanfilePath, extension);

            if (dependencies.length === 0) {
                vscode.window.showInformationMessage(`No dependencies found yet`);
            } else {
                vscode.window.showInformationMessage(`Parsed ${dependencies.length} dependencies`);
            }

            return Promise.resolve(dependencies);
        } catch(error) {
            vscode.window.showErrorMessage(`Failed to parse conanfile.${extension}. See log for more information`);
            console.log(`Failed to parse ${conanfilePath}: ${error}`);
            return Promise.resolve([]);
        }
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }

        return true;
    }

    private getDepsInConanfile(conanfile: string, extension: string): ConanDependency[] {
        const content = fs.readFileSync(conanfile, "utf-8");

        if (extension === "txt") {
            return conan.parseTxt(content);
        } 
        
        return conan.parsePython(content);
    }
}

export class ConanDependency extends vscode.TreeItem {
    constructor(
        public readonly name: string,
        private version: string,
        public company?: string,
        public channel?: string,
        public readonly collabsibleState?: vscode.TreeItemCollapsibleState
    ) {
        super(name, collabsibleState);
    }

    get tooltip(): string {
        return `${this.name}-${this.version}`;
    }

    get description(): string {
        return this.version;
    }
}