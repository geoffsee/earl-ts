export function isEmpty(obj: unknown) {
    return obj == undefined;
}

export type EarlRecord = {
    originPath: string;
    destinationUrl: string
}