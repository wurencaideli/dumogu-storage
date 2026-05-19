import { Storage, allModel, Model } from './base.js';
export * from './base.js';

export interface DumoguStorageOption {
    model?: Model;
    modelName?: string;
    isRealTime?: boolean;
    beforeSet?: (value: any) => any;
    beforeGet?: (value: any) => any;
}

export default class DumoguStorage extends Storage {
    beforeSet?: (value: any) => any;
    beforeGet?: (value: any) => any;
    isRealTime!: boolean;
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
    constructor(key: string, value: any, option: DumoguStorageOption = {}) {
        super();
        let { model, modelName, isRealTime = false, beforeSet, beforeGet } = option;
        {
            if (!key) throw `key不能为空`;
            if (!model) {
                model = allModel[modelName!];
            }
            if (!model) throw `没有 ${modelName} 此模式 已有模式local,session,uni,wx`;
            if (typeof model !== 'object') throw `没有找到储存模式对象`;
        }
        this.key = key;
        this.model = model;
        this.beforeSet = beforeSet;
        this.beforeGet = beforeGet;
        this.isRealTime = isRealTime;
        if (!!this.model.get(key)) {
            this.take();
        } else {
            this.value = value;
        }
    }
    /**
     * 刷新实例，重新从缓存中获取数据
     */
    refresh(): void {
        this.take();
    }
    /**
     * 获取所有keys
     */
    keys(): string[] {
        return this.model.keys();
    }
    /**
     * 获取数据
     */
    getValue(): any {
        return this.value;
    }
    /**
     * 写入数据
     */
    setValue(value: any): void {
        this.value = value;
    }
    /**
     * 获取数据
     */
    get value(): any {
        if (this.isRealTime) {
            this.take();
        }
        let value = this.value__;
        if (!!this.beforeGet) {
            value = this.beforeGet(value);
        }
        return value;
    }
    /**
     * 写入数据
     */
    set value(newValue: any) {
        if (this.beforeSet) {
            newValue = this.beforeSet(newValue);
        }
        this.value__ = newValue;
        this.save();
    }
}
