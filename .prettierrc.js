module.exports = {
    tabWidth: 4,
    printWidth: 120,
    overrides: [
        {
            files: "*.yml",
            options: {
                // YAML already forces 2-space indentation when defining array objects, so it's
                // more consistent to use 2 spaces globally
                tabWidth: 2,
            },
        },
        {
            files: "*.json",
            options: {
                // This project uses
                tabWidth: 2,
            },
        },
    ],
};
