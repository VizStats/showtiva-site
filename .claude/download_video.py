import urllib.request

video_url = "https://v1.pinimg.com/videos/iht/expMp4/ac/7d/47/ac7d47408c4f5915831938e19b183701_720w.mp4"
destination = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video.mp4"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request(video_url, headers=headers)

print(f"Downloading new Pinterest video from {video_url}...")
try:
    with urllib.request.urlopen(req) as response:
        with open(destination, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Video saved to {destination}")
except Exception as e:
    print(f"Error downloading: {e}")
