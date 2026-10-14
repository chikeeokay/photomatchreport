"""Download verified engine assets at build time. Python standard library only."""
from pathlib import Path
from urllib.request import Request, urlopen
import hashlib,json,time
ROOT=Path(__file__).resolve().parent
DIST=ROOT/'dist'
CACHE=ROOT/'.engine-cache'

def main():
    DIST.mkdir(exist_ok=True);CACHE.mkdir(exist_ok=True)
    manifest={}
    for source in json.loads((ROOT/'engine-sources.json').read_text()):
        name=source['name'];cached=CACHE/(source['sha256']+'.bin')
        data=cached.read_bytes() if cached.exists() else b''
        if hashlib.sha256(data).hexdigest()!=source['sha256']:
            for attempt in range(3):
                try:
                    print('Downloading '+name+' engine...',flush=True)
                    with urlopen(Request(source['url'],headers={'User-Agent':'PhotoMatch-build/3.1'}),timeout=120) as response:data=response.read()
                    if hashlib.sha256(data).hexdigest()!=source['sha256']:raise ValueError('Checksum mismatch for '+name)
                    cached.write_bytes(data);break
                except Exception:
                    if attempt==2:raise
                    time.sleep(2)
        parts=[]
        for offset in range(0,len(data),4*1024*1024):
            part=data[offset:offset+4*1024*1024];filename=f'{name}-{offset//(4*1024*1024)}.bin'
            (DIST/filename).write_bytes(part)
            parts.append({'file':filename,'sha256':hashlib.sha256(part).hexdigest()})
        manifest[name]=parts
        print('Verified and packaged '+name,flush=True)
    (DIST/'assets.json').write_text(json.dumps(manifest))
    print('Static site ready in dist/',flush=True)
if __name__=='__main__':main()
