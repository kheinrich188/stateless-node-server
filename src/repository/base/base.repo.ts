import { getRepository } from 'typeorm';

export type ObjectType<T> = { new (): T } | Function;

export default abstract class BaseRepository<T> {
    private readonly type: ObjectType<T>;
    protected constructor(type: ObjectType<T>) {
        this.type = type;
    }

    async all(): Promise<T[]> {
        return await getRepository<T>(this.type).find();
    }

    async clear(): Promise<void> {
        return await getRepository<T>(this.type).clear();
    }

    async delete(id: string) {
        return await getRepository<T>(this.type).delete(id);
    }
}
