module.exports = {
    "**/*.{ts,tsx,js}": [`eslint --fix`, `prettier --write`],
    "**/*.{css,scss,md,mdx}": ["prettier --write"],
};
