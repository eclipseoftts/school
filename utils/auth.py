

# 用户认证，日志记录
def pass_token(func):
    async def wrapper(self, *args, **kwargs):
        print("-------------")