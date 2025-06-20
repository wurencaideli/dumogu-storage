import { Storage, allModel } from './base';

export default class DumoguStorage extends Storage {
    isDestroyed = false;
    beforSet;
    beforGet;
    isRealTime;
    /**
     * 创建一个实例
     * @param {String} key    存储键
     * @param {any} value  初始值
     * @param {Object} option 配置
     * option部分参数
     * model：自定义存储模式
     * modelName：存储模式名
     * isRealTime：实时性的
     */
    constructor(key, value, option = {}) {
        super();
        let { model, modelName, isRealTime = false, beforSet, beforGet } = option;
        {
            if (!key) throw `key不能为空`;
            if (!model) {
                model = allModel[modelName];
            }
            if (!model) throw `没有 ${modelName} 此模式 已有模式local,session,uni,wx`;
            if (typeof model !== 'object') throw `没有找到储存模式对象`;
        }
        this.key = key;
        this.model = model;
        this.beforSet = beforSet;
        this.beforGet = beforGet;
        this.isRealTime = isRealTime;
        if (!!this.model.get(key)) {
            this.take();
        } else {
            this.value = value;
        }
    }
    /**
     * 刷新实例，重新从缓存中获取数据
     * @returns {void}
     */
    refresh() {
        this.take();
    }
    /**
     * 获取所有keys
     * @returns {Array<String>}
     */
    keys() {
        return this.model.keys();
    }
    /**
     * 获取数据
     * @returns {any}
     */
    getValue() {
        return this.value;
    }
    /**
     * 写入数据
     * @param {any} value
     * @returns {void}
     */
    setValue(value) {
        this.value = value;
    }
    /**
     * 获取数据
     * @returns {any}
     */
    get value() {
        if (this.isRealTime) {
            this.take();
        }
        let value = this.value__;
        if (!!this.beforGet) {
            value = this.beforGet(value);
        }
        return value;
    }
    /**
     * 写入数据
     * @param {any} value
     * @returns {void}
     */
    set value(newValue) {
        if (this.beforSet) {
            newValue = this.beforSet(newValue);
        }
        this.value__ = newValue;
        this.save();
    }
}
