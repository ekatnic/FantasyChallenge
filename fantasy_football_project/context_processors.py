from waffle import flag_is_active

def entry_lock(request):
    return {'entry_lock': flag_is_active(request, 'entry_lock')}