import json, urllib.request, os
import urllib.error

# Read credentials
with open('/opt/data/home/.git-credentials') as f:
    lines = f.read().strip().split('\n')

# First token (the one used for flappy-sterling)
line = lines[0]
token = ':'.join(line.split(':')[2:]).split('@')[0]

print(f'Token: {token[:10]}...{token[-4:]}')

# Create the repo
req = urllib.request.Request(
    'https://api.github.com/user/repos',
    data=json.dumps({
        'name': 'SP-nake',
        'description': 'Snake game for Sterling',
        'private': False
    }).encode(),
    headers={
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
    },
    method='POST'
)

try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    print(f'✅ Repo created: {data["html_url"]}')
    print(f'Clone URL: {data["clone_url"]}')
except urllib.error.HTTPError as e:
    body = e.read().decode()
    err = json.loads(body)
    if any('already exists' in str(err_item) for err_item in err.get('errors', [])):
        print('ℹ️  Repo already exists')
    else:
        print(f'❌ HTTP {e.code}: {err.get("message", err)}')
        # Try to give helpful info
        if e.code == 401:
            print('   (Token needs repo creation scope or is invalid)')
        elif e.code == 403:
            print('   (Token lacks permission for this action)')
