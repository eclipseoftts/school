import redis


class Redis:

    @staticmethod
    def get_redis():
        return redis.Redis()

    @staticmethod
    def save(key, value):
        r = Redis.get_redis()
        r.set(name=key, value=value)

    @staticmethod
    def get(key):
        if key is None or len(str(key)) == 0:
            return None
        r = Redis.get_redis()
        try:
            return r.get(key)
        except (ConnectionError, TimeoutError) as e:
            return None
