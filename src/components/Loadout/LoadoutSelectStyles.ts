// dear god something with the StylesConfig type from react-select causes my IDE to freeze
// whenever I edit this. Using anys because that's nutty
export const loadoutSelectStyles = {
    container: (base: any) => ({ ...base }),
    control: (base: any) => ({
        ...base,
        minWidth: 240,
        margin: 8,
        backgroundColor: "#4c3c2f",
        border: "1px solid #716F6D",
        borderRadius: 3,
        boxShadow: "inset 0 0 2px 1px rgba(15,11,8, .5), inset 1px 2px 2px rgba(83,61,38, .8)",
        cursor: "pointer",
    }),
    input: (base: any) => ({ ...base, color: "#fff", }),
    valueContainer: (base: any) => ({
        ...base,
    }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    menuList: (base: any) => ({ ...base }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected ? 'rgba(201,182,146,.4)' : state.isFocused ? 'rgba(201,182,146,.2)' : 'transparent',
        '&:active' : {
            backgroundColor: "rgba(201,182,146,.4)",
        }
    }),
    placeholder: (base: any) => ({ ...base }),
};