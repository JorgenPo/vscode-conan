import { ConanDependency } from "./treeViewProvider";
import { TreeItemCollapsibleState } from "vscode";

const REQUIRES_SECTION = "[requires]";

function isSection(line: string): boolean {
    return line.match(/\[(.+)\]/) !== null;
}

function toConanDependency(line: string): ConanDependency {
    // name/version@[company/channel]
    const dependencyRegexp = /([a-zA-Z]+)\/(\d+\.?\d*\.?\d*)(@([a-zA-Z]+)\/([a-zA-Z]+))?/;
    const matches = line.match(dependencyRegexp);

    if (matches && matches.length > 2) {
        const hasCompanyAndChannel = matches.length === 5;

        let dependency = new ConanDependency(matches[1], matches[2]);
        if (hasCompanyAndChannel) {
            dependency.company = matches[4];
            dependency.channel = matches[5];
        }

        return dependency;
    }

    throw Error(`Failed to parse conan dependency: ${line}`);
}

export function parseTxt(content: string): ConanDependency[] {
    const lines = content.split(/[\r\n]+/);

    let isInRequiresSection = false;
    let dependencies: string[] = [];

    lines.forEach(line => {
        if (line === REQUIRES_SECTION) {
            isInRequiresSection = true;
            return;
        } else if (isSection(line)) {
            isInRequiresSection = false;
            return;
        }

        // Line in requires section
        if (isInRequiresSection) {
            dependencies.push(line);
        }
    });

    return dependencies.map(toConanDependency);
}

export function parsePython(content: string): ConanDependency[] {
    throw new Error("Python conanfile isn't supported yet");
}