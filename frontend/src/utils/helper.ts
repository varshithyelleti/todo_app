export const replaceUrlParams = (url: string, params: { [key: string]: any }) => {
    for (const key in params) {
        url = url.replace(`:${key}`, params[key]);
    }
    return url;
};

export const snakeCaseToTitleCase = (inputString: string) => {
    return inputString != null ? inputString.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "";
}
