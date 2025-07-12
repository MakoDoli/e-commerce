import Redis from "ioredis";
import { config } from "dotenv";
config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
//await redis.set("foo", "bar");
