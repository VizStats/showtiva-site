import urllib.request

video_5_url = "https://v1.pinimg.com/videos/iht/expMp4/8a/49/28/8a4928252ab61dc280c22f34116639aa_720w.mp4"
video_5_dest = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video_5.mp4"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request(video_5_url, headers=headers)

print(f"Downloading Slide 5 video from {video_5_url}...")
try:
    with urllib.request.urlopen(req) as response:
        with open(video_5_dest, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Slide 5 video saved to {video_5_dest}")
except Exception as e:
    print(f"Error downloading: {e}")
