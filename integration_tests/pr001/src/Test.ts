// noinspection JSUnusedGlobalSymbols
export class BeholdTypescriptFeatures {
    private privateField = -1;

    constructor() {
        console.log(this.privateField);
    }

    genericMethod<T>(a: T) {
        console.info(a);
    }

    optionalArgument(a?: number) {
        console.info(a);
    }

    variadicArguments(...a: number[]) {
        console.info(a);
    }
}

export function someFunc(a: string | null | number) {
    return new BeholdTypescriptFeatures().genericMethod(typeof a + 1);
}

someFunc('test');