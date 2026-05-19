export interface Model {
    name: string;
    get(key: string): any;
    set(key: string, value: string): void;
    remove(key: string): void;
    keys(): string[];
}

export class Storage {
    key!: string;
    value__!: any;
    model!: Model;
    isDestroyed: boolean = false;
    constructor() {}
    /**
     * 写入数据,保存自身(实时)
     */
    save(): void {
        const { key, model, value__ } = this;
        const data = {
            value: value__,
            type: typeof value__,
            name: 'dumogu-storage',
        };
        try {
            model.set(key, JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    }
    /**
     * 拿取数据(实时)
     */
    take(): void {
        const { key, model } = this;
        let value = undefined;
        try {
            const data = JSON.parse(model.get(key));
            if (!data) throw '数据转换失败，或者数据已丢失';
            value = data.value;
        } catch (error) {
            console.error(error);
        }
        this.value__ = value;
    }
    /**
     * 销毁实例
     */
    destroy(): void {
        delete (this as any).model;
        delete (this as any).key;
        delete (this as any).value__;
        this.isDestroyed = true;
    }
    /**
     * 清空储存
     */
    remove(): void {
        this.model.remove(this.key);
        delete this.value__;
    }
}
export const allModel: Record<string, Model> = {
    local: {
        name: 'local',
        get(key) {
            return localStorage.getItem(key);
        },
        set(key, value) {
            localStorage.setItem(key, value);
        },
        remove(key) {
            localStorage.removeItem(key);
        },
        keys() {
            return Object.keys(localStorage);
        },
    },
    session: {
        name: 'session',
        get(key) {
            return sessionStorage.getItem(key);
        },
        set(key, value) {
            sessionStorage.setItem(key, value);
        },
        remove(key) {
            sessionStorage.removeItem(key);
        },
        keys() {
            return Object.keys(sessionStorage);
        },
    },
    uni: {
        name: 'uni',
        get(key) {
            return uni.getStorageSync(key);
        },
        set(key, value) {
            uni.setStorageSync(key, value);
        },
        remove(key) {
            uni.removeStorageSync(key);
        },
        keys() {
            return uni.getStorageInfoSync().keys;
        },
    },
    wx: {
        name: 'wx',
        get(key) {
            return wx.getStorageSync(key);
        },
        set(key, value) {
            wx.setStorageSync(key, value);
        },
        remove(key) {
            wx.removeStorageSync(key);
        },
        keys() {
            return wx.getStorageInfoSync().keys;
        },
    },
};
