export const STR64: Array<string> = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/').split( '' );

export const to64String = ( input: number, current: string = '' ): string => {
    if ( input < 0 && current.length == 0 ){
        input = input * - 1;
    }
    var modify: number = input % 64;
    var remain: number = Math.floor( input / 64 );
    var result: string = STR64[ modify ] + current;
    return ( remain <= 0 ) ? result : to64String( remain, result );
};

export const to64Parse =( input: string ): number => {
    let result: number = 0;
    const toProc: Array<string> = input.split( '' );
    for ( let e in toProc ){
        result = ( result * 64 ) + STR64.indexOf( toProc[ e ] );
    }
    return result;
};