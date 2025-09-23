from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Só permite modificações para o dono do recurso.
    """

    def has_object_permission(self, request, view, obj):
        # leitura permitida a todos
        if request.method in permissions.SAFE_METHODS:
            return True
        # caso o objeto possua 'provider' ou 'client' ou 'owner'
        owner_fields = ["provider", "client", "owner"]
        for f in owner_fields:
            if hasattr(obj, f):
                return getattr(obj, f) == request.user
        return False
