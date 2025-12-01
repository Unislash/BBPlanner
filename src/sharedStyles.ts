export const buttonResetStyles = `
    text-transform: none; // Remove inheritance of text transform in Firefox
    overflow: visible; // Show overflow in Edge
    margin: 0; // Remove margin in Firefox and Safari
    padding: 0; // Remove padding in webkit
    outline: none; // Remove default focus outline in various browsers
    font-family: inherit; // Ensure we inherit from parent since many browsers override this in user-agent stylesheet.
    color: inherit; // Ensure we inherit from parent since many browsers override this in user-agent stylesheet.

    &::-moz-focus-inner {
        border: 0;
        margin: 0;
        padding: 0;
    }
`;