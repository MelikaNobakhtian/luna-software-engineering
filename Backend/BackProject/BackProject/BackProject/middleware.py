from urllib.parse import parse_qs

from  basicapp.models import User
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.auth import AuthMiddleware, AuthMiddlewareStack, UserLazyObject
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from rest_framework_simplejwt.tokens import AccessToken



@database_sync_to_async
def get_user(scope):
    close_old_connections()
    query_string = parse_qs(scope['query_string'].decode())
    token = query_string.get('id')
    print('--------------')
    print(token)
    if not token:
        print('0000')
        return AnonymousUser()
    try:
        print('1111')
        
        # token2 = User.objects.get(key=access_token)
        # print(token2)
        user = User.objects.get(id=token[0])
    except Exception as exception:
        print('2222')
        return AnonymousUser()
    if not user.is_active:
        print('3333')
        return AnonymousUser()
    print('4444')
    return user


class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)


def TokenAuthMiddlewareStack(inner):
    print('------')
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))