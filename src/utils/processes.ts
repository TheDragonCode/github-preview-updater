import { promisify } from 'node:util'
import { exec as nodeExec } from 'node:child_process'

export const exec = async (command: string): Promise<string> => {
    const execAsync = promisify(nodeExec);

    const { stdout } = await execAsync(command);

    return stdout.toString().trim();
};
