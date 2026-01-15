import { getInput } from "@actions/core";

export const TOKEN = {
    name: "token",
};

export const CONFIG_PATH = {
    name: "config",
    defaultValue: ".github/preview-updater.yml",
};

export const README_PATH = {
    name: "readme",
    defaultValue: "README.md",
};

export const parse = () => {
    const token = getInput(TOKEN.name, { required: true });
    const configPath = getInput(CONFIG_PATH.name) || CONFIG_PATH.defaultValue;
    const readmePath = getInput(README_PATH.name) || README_PATH.defaultValue;

    return {
        token,
        configPath,
        readmePath,
    };
};
