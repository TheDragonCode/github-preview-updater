import { getInput } from "@actions/core";

export const TOKEN = {
    name: "token",
    env: "INPUT_TOKEN",
};

export const CONFIG_PATH = {
    name: "configPath",
    env: "INPUT_CONFIG_PATH",
    defaultValue: ".github/preview-updater.yml",
};

export const parse = () => {
    const token = getInput(TOKEN.name, { required: true });
    const configPath = getInput(CONFIG_PATH.name) || CONFIG_PATH.defaultValue;

    return {
        token,
        configPath,
    };
};
