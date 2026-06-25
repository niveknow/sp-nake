import json, urllib.request, urllib.error

# Read the PAT from git-credentials
with open('/opt/data/home/.git-credentials') as f:
    for line in f:
        if 'sp-nake' in line or 'SP-nake' in line:
            # Format: https://niveknow:TOKEN@github.com
            token = line.strip().split(':')[2].split('@')[0]
            break
    else:
        # Fallback - try the last token
        lines = f.read().strip().split('\n')
        # Need to re-read since we consumed the file
        f.seek(0)
        for line in f:
            if 'sp-nake' in line or 'SP-nake' in line:
                token = line.strip().split(':')[2].split('@')[0]
                break

# We know the token was appended earlier, let's read fresh
with open('/opt/data/home/.git-credentials') as f:
    content = f.read()

# Parse all lines - some are full URL format, some might be raw tokens
lines = content.strip().split('\n')
token = None
for line in lines:
    parts = line.split(':')
    if len(parts) >= 3 and '@' in parts[2]:
        # Format: https://niveknow:TOKEN@github.com
        token = parts[2].split('@')[0]
        break
    elif line.startswith('github_pat'):
        # Raw token format
        token = line.strip()
        break
    elif 'github_pat' in line:
        # Extract the pat from anywhere in the line
        import re
        match = re.search(r'github_pat_[a-zA-Z0-9]+', line)
        if match:
            token = match.group(0)
            break

if not token:
    print('❌ Token not found')
    exit(1)

print(f'Using token: {token[:12]}...{token[-4:]}')

# Update repo
req = urllib.request.Request(
    'https://api.github.com/repos/niveknow/sp-nake',
    data=json.dumps({
        'description': '🐍 SP-nake — a Snake game with Sterling face, sushi, candy & ice cream! Made for a 10-year-old game developer 🍣🍬🍨',
        'homepage': 'https://niveknow.github.io/sp-nake/',
        'topics': ['snake-game', 'html5-game', 'canvas-game', 'kids-coding', 'educational-game', 'sushi']
    }).encode(),
    headers={
        'Authorization': f'Bearer {token}',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
    },
    method='PATCH'
)

try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    print(f'✅ Updated!')
    print(f'  Description: {data.get("description", "N/A")[:60]}...')
    print(f'  Homepage: {data.get("homepage")}')
    print(f'  Topics: {data.get("topics")}')
except urllib.error.HTTPError as e:
    body = json.loads(e.read().decode())
    print(f'❌ HTTP {e.code}: {body.get("message")}')
