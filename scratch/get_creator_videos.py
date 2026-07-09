import urllib.request
import re
import os
import json

urls = [
    "https://www.pinterest.com/pin/8303580559709695/",
    "https://www.pinterest.com/pin/497436721357375003/",
    "https://www.pinterest.com/pin/2322237302930446/",
    "https://www.pinterest.com/pin/8092474327750199/",
    "https://www.pinterest.com/pin/8092474327188986/"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

dest_dir = r"c:\Users\HOME PC\Documents\Show Tiva\public"

def get_direct_video_url(pin_url):
    print(f"Fetching page metadata for {pin_url}...")
    req = urllib.request.Request(pin_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
            # 1. Try finding in __PWS_DATA__ or json
            # Look for video urls matching v1.pinimg.com/videos/
            matches = re.findall(r'https://v1\.pinimg\.com/videos/[^\s"\']+\.mp4', html)
            if matches:
                # Filter out duplicate URLs and find the highest quality (e.g. 720w or expMp4)
                unique_matches = list(set(matches))
                print(f"Found matches: {unique_matches}")
                # Prefer 720w or larger videos
                for m in unique_matches:
                    if '720w' in m or '720p' in m or '1080p' in m:
                        return m
                return unique_matches[0]
            
            # 2. Try looking in ld+json or contentUrl
            content_url_match = re.search(r'"contentUrl"\s*:\s*"([^"]+)"', html)
            if content_url_match:
                url = content_url_match.group(1)
                if '.mp4' in url:
                    return url
            
            # 3. Fallback generic mp4 search
            mp4_matches = re.findall(r'http[s]?://[^\s"\']+\.mp4', html)
            if mp4_matches:
                print(f"Fallback matches: {list(set(mp4_matches))}")
                return list(set(mp4_matches))[0]
                
    except Exception as e:
        print(f"Failed to read page: {e}")
    return None

for i, url in enumerate(urls):
    dest_path = os.path.join(dest_dir, f"creator_video_{i+1}.mp4")
    print(f"\n--- Processing Video {i+1} ---")
    video_url = get_direct_video_url(url)
    if video_url:
        # Unquote URL if necessary
        video_url = video_url.replace(r'\u002F', '/')
        video_url = video_url.replace('\\/', '/')
        print(f"Direct video URL found: {video_url}")
        
        # Download video
        print(f"Downloading to {dest_path}...")
        req = urllib.request.Request(video_url, headers=headers)
        try:
            with urllib.request.urlopen(req) as response:
                with open(dest_path, 'wb') as f:
                    f.write(response.read())
            print(f"Success! Saved video {i+1} to {dest_path}")
        except Exception as e:
            print(f"Download failed: {e}")
    else:
        print(f"Could not find direct video URL for {url}")
