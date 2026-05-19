declare const uni: {
    getStorageSync(key: string): any;
    setStorageSync(key: string, value: any): void;
    removeStorageSync(key: string): void;
    getStorageInfoSync(): { keys: string[] };
};

declare const wx: {
    getStorageSync(key: string): any;
    setStorageSync(key: string, value: any): void;
    removeStorageSync(key: string): void;
    getStorageInfoSync(): { keys: string[] };
};
