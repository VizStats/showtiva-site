import urllib.request

video_3_url = "https://v1.pinimg.com/videos/iht/expMp4/9f/3f/dc/9f3fdc18b15df0ed749adaf9a29e2697_720w.mp4"
video_3_dest = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video_3.mp4"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request(video_3_url, headers=headers)

print(f"Downloading Slide 3 video from {video_3_url}...")
try:
    with urllib.request.urlopen(req) as response:
        with open(video_3_dest, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Slide 3 video saved to {video_3_dest}")
except Exception as e:
    print(f"Error downloading: {e}")
