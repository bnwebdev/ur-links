export type Localization = {
    namespace: string; 
    resources: {
        [locale: string]: Record<string, any>;
    };
};
