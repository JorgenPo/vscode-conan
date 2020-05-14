import { exec } from "child_process";
import * as vscode from 'vscode';

class Version {
    constructor(public major: number, public minor: number, public patch: number) {
        
    }

    stringify(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}

function execute(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
            if (err) {
                reject(err);
            }

            resolve(stdout);
        });
    });
}

export class ConanAPI {
    version: Version = new Version(0, 0, 0);
    installed: boolean = false;

    constructor(private context: vscode.ExtensionContext) {
        this.checkConan().then(result => {
            if (result) {
                vscode.window.showInformationMessage(`Conan version ${this.version.stringify()} detected`);
                this.installed = true;
            } else {
                vscode.window.showErrorMessage("Failed to run conan, vscode-conan commands won't work");
            }
        });
    }

    // conan install ${workspace}
    async install() {

    }

    // conan --version
    async getVersion(): Promise<Version> {
        try {
            let stdout: string = await execute("conan --verssion");

            const versionRegexp = /(\d+)\.(\d+)\.(\d+)/;
            let match = stdout.match(versionRegexp);

            if (!match) {
                throw Error("Failed to match version output with the regexp");
            }

            return new Version(+match[1], +match[2], +match[3]);
        } catch(err) {
            throw Error("Failed to execute conan --version");
        }
    }

    async checkConan(): Promise<boolean> {
        try {
            this.version = await this.getVersion();
        } catch (error) {
            console.warn("Failed to check conan: conan version command failed:", error);
            return false;
        }
        
        return true;
    }
}