import os
import urllib.request

video_2_url = "https://v1.pinimg.com/videos/iht/expMp4/95/d1/60/95d160f5b0857071b2d7ac8c1575900b_720w.mp4"
video_1_dest = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video_1.mp4"
video_2_dest = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video_2.mp4"
original_path = r"c:\Users\HOME PC\Documents\Show Tiva\public\bg_video.mp4"

# Rename original if it exists and bg_video_1 doesn't
if os.path.exists(original_path) and not os.path.exists(video_1_dest):
    print("Renaming original bg_video.mp4 to bg_video_1.mp4...")
    os.rename(original_path, video_1_dest)
elif os.path.exists(original_path) and os.path.exists(video_1_dest):
    print("Removing legacy bg_video.mp4 to avoid confusion...")
    os.remove(original_path)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
}

req = urllib.request.Request(video_2_url, headers=headers)

print(f"Downloading Slide 2 video from {video_2_url}...")
try:
    with urllib.request.urlopen(req) as response:
        with open(video_2_dest, 'wb') as out_file:
            out_file.write(response.read())
    print(f"Success! Slide 2 video saved to {video_2_dest}")
except Exception as e:
    print(f"Error downloading: {e}")
