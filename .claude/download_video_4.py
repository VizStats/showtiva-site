import urllib.request

video_4_url = "https://v1.pinimg.com/videos/iht/expMp4/6c/1e/95/6c1e95d9d409bb3f999cf35e56a09a30_720w.mp4"
video_4_dest = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video_4.mp4"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request(video_4_url, headers=headers)

print(f"Downloading Slide 4 video from {video_4_url}...")
try:
    with urllib.request.urlopen(req) as response:
        with open(video_4_dest, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Slide 4 video saved to {video_4_dest}")
except Exception as e:
    print(f"Error downloading: {e}")
