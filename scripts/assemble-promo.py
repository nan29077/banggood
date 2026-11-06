from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1];tmp=root/'docs/promo-source'
args=[]
for i in range(6):args+=['-i',str(tmp/f'{i}.mp4')]
args+=['-i',str(tmp/'music.wav')]
f=[f'[{i}:v]settb=AVTB,setpts=PTS-STARTPTS,fps=24[v{i}]' for i in range(6)];last='v0'
for i in range(1,6):f.append(f'[{last}][v{i}]xfade=transition=fade:duration=0.6:offset={i*6.9},fps=24[x{i}]');last=f'x{i}'
f.append(f'[{last}]fade=t=in:d=0.6,fade=t=out:st=41.2:d=0.8[out]')
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args,'-filter_complex_threads','1','-filter_complex',';'.join(f),'-map','[out]','-map','6:a','-t','42','-c:v','libx264','-preset','fast','-crf','23','-threads','2','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',str(root/'dist/assets/video/banggeut-story.mp4')],check=True)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','2','-i',str(root/'dist/assets/video/banggeut-story.mp4'),'-frames:v','1',str(root/'dist/assets/video/banggeut-story-poster.jpg')],check=True)
print('42-second video ready')
