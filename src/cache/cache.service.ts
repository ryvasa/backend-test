import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cache.get<T>(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await this.cache.set(key, value, { ttl });
    } catch (error) {
      console.error('Cache set error:', error);
      throw new InternalServerErrorException('Failed to set cache');
    }
  }
}
