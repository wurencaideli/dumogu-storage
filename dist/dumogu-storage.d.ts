import { Storage, Model } from './base.js';
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
    isRealTime: boolean;
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
    constructor(key: string, value: any, option?: DumoguStorageOption);
    /**
     * 刷新实例，重新从缓存中获取数据
     */
    refresh(): void;
    /**
     * 获取所有keys
     */
    keys(): string[];
    /**
     * 获取数据
     */
    getValue(): any;
    /**
     * 写入数据
     */
    setValue(value: any): void;
    /**
     * 获取数据
     */
    get value(): any;
    /**
     * 写入数据
     */
    set value(newValue: any);
}
