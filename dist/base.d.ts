export interface Model {
    name: string;
    get(key: string): any;
    set(key: string, value: string): void;
    remove(key: string): void;
    keys(): string[];
}
export declare class Storage {
    key: string;
    value__: any;
    model: Model;
    isDestroyed: boolean;
    constructor();
    /**
     * 写入数据,保存自身(实时)
     */
    save(): void;
    /**
     * 拿取数据(实时)
     */
    take(): void;
    /**
     * 销毁实例
     */
    destroy(): void;
    /**
     * 清空储存
     */
    remove(): void;
}
export declare const allModel: Record<string, Model>;
