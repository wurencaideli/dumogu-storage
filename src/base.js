export class Storage {
    key;
    value__;
    model;
    isDestroyed = false;
    constructor() {}
    /**
     * 写入数据,保存自身(实时)
     * @returns {void}
     */
    save() {
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
     * @returns {void}
     */
    take() {
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
     * @returns {void}
     */
    destroy() {
        delete this.model;
        delete this.key;
        delete this.value__;
        this.isDestroyed = true;
    }
    /**
     * 清空储存
     * @returns {void}
     */
    remove() {
        this.model.remove(this.key);
        delete this.value__;
    }
}
export const allModel = {
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
            return wx.getStorageInfoSync.getItem(key);
        },
        set(key, value) {
            wx.setStorageInfoSync.setItem(key, value);
        },
        remove(key) {
            wx.removeStorageSync.removeItem(key);
        },
        keys() {
            return wx.getStorageInfoSync().keys;
        },
    },
};
