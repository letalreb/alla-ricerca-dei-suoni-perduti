# Bunny.net Integration

This directory contains scripts and documentation for integrating Bunny.net as a video hosting alternative to Internet Archive.

## 📁 Files Overview

### Scripts
- **`upload-to-bunny.js`** - Main script to upload all videos to Bunny.net
- **`test-bunny-upload.js`** - Test script to upload a single video (for testing configuration)
- **`update-instruments-with-bunny.js`** - Updates instruments.js with Bunny.net URLs after upload

### Documentation
- **`BUNNY_SETUP_GUIDE.md`** - Complete setup guide for Bunny.net (READ THIS FIRST!)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install axios form-data
```

### 2. Configure Bunny.net

Follow the detailed guide in [`BUNNY_SETUP_GUIDE.md`](./BUNNY_SETUP_GUIDE.md)

Quick `.env` setup for **Storage method** (recommended for testing):
```bash
BUNNY_UPLOAD_METHOD=storage
BUNNY_STORAGE_ZONE_NAME=your-storage-zone-name
BUNNY_STORAGE_API_KEY=your-storage-api-key
BUNNY_STORAGE_REGION=de
BUNNY_PULL_ZONE_URL=https://your-pullzone.b-cdn.net
```

### 3. Test Upload (Single Video)
```bash
# Test with instrument ID 1
node scripts/test-bunny-upload.js 1

# Test with another instrument
node scripts/test-bunny-upload.js 5
```

### 4. Upload All Videos
```bash
node scripts/upload-to-bunny.js
```

This will:
- Upload all videos from `public/bck/`
- Show progress in real-time
- Skip already uploaded videos
- Save mappings to `bunny-mappings.json`

### 5. Update Website
```bash
node scripts/update-instruments-with-bunny.js
```

This will:
- Read `bunny-mappings.json`
- Update `app/data/instruments.js` with Bunny.net URLs
- Create a backup of the original file

### 6. Test the Site
```bash
npm run dev
```

Visit http://localhost:3000 and verify videos play correctly.

## 🎯 Bunny.net Methods

### Method 1: Storage + Pull Zone (File Hosting)
**Best for:** Simple file hosting with CDN

**Pros:**
- ✅ Simple and cheap
- ✅ Full control over player
- ✅ Works with already optimized videos

**Setup:** See [BUNNY_SETUP_GUIDE.md](./BUNNY_SETUP_GUIDE.md#metodo-1-storage--pull-zone)

### Method 2: Stream (Video Streaming)
**Best for:** Professional video streaming

**Pros:**
- ✅ Automatic transcoding
- ✅ Adaptive bitrate streaming
- ✅ Modern player with analytics
- ✅ Automatic thumbnails

**Setup:** See [BUNNY_SETUP_GUIDE.md](./BUNNY_SETUP_GUIDE.md#metodo-2-stream)

## 🎨 Video Player Components

### UniversalPlayer (Recommended)
Automatically uses the best available video source:
1. Bunny.net (if configured)
2. Internet Archive (fallback)
3. Local files (last resort)

```javascript
import UniversalPlayer from '@/app/_components/UniversalPlayer';

<UniversalPlayer instrument={instrument} />
```

### BunnyPlayer
Direct Bunny.net player (supports both Storage and Stream):

```javascript
import BunnyPlayer from '@/app/_components/BunnyPlayer';

<BunnyPlayer
  bunnyMethod="storage"
  bunnyUrl="https://cdn.example.com/video.mp4"
  title="Instrument Name"
/>
```

### ArchivePlayer
Internet Archive player (existing):

```javascript
import ArchivePlayer from '@/app/_components/ArchivePlayer';

<ArchivePlayer
  archiveId="video-id"
  embedUrl="https://archive.org/embed/video-id"
  title="Instrument Name"
/>
```

## 📊 Cost Estimation

### Your Actual Usage (Few visits/day)
For 90 videos (~40MB each) with **5-10 visits/day** (~450 video views/month):

**Storage Method:**
- Storage: ~€0.04/month
- Bandwidth: ~€0.18/month
- **Total: ~€0.22/month** 🎉

**Stream Method:**
- Storage: ~€0.02/month
- Encoding: ~€0.07 (one-time)
- Bandwidth: ~€0.18/month
- **Total: ~€0.20/month + setup** 🎉

💰 **With €5 free credit = ~23 months FREE hosting!**

### If Traffic Grows (1000 views/month)
- Storage: ~€0.04/month
- Bandwidth: ~€40/month
- **Total: ~€40/month**

💡 **Bottom line:** With your current low traffic, Bunny.net is essentially **FREE for almost 2 years**!

## 🔧 Troubleshooting

### Upload fails with 401 error
```
❌ Error: 401 Unauthorized
```
- Verify API key in `.env`
- Verify Storage Zone name is correct
- Check if API key has correct permissions

### Video doesn't load
- Run: `node scripts/update-instruments-with-bunny.js`
- Check `bunny-mappings.json` contains the instrument ID
- Verify the video URL is accessible in browser

### Test upload script
```bash
# Test configuration and upload single video
node scripts/test-bunny-upload.js 1
```

## 📝 File Structure

```
scripts/
├── BUNNY_SETUP_GUIDE.md          # Complete setup guide
├── README_BUNNY.md                # This file
├── upload-to-bunny.js             # Main upload script
├── test-bunny-upload.js           # Test upload script
└── update-instruments-with-bunny.js  # Update instruments.js

app/_components/
├── BunnyPlayer.js                 # Bunny.net video player
├── BunnyPlayer.module.css
├── UniversalPlayer.js             # Universal player (Bunny + Archive)
├── ArchivePlayer.js               # Internet Archive player (existing)
└── ArchivePlayer.module.css

bunny-mappings.json                # Generated by upload script
.env                               # Your Bunny.net credentials
```

## 🔗 Resources

- 📚 [Complete Setup Guide](./BUNNY_SETUP_GUIDE.md)
- 🌐 [Bunny.net Dashboard](https://dash.bunny.net)
- 📖 [Bunny.net Documentation](https://docs.bunny.net)
- 💬 [Bunny.net Discord](https://bunny.net/discord)

## 🎯 Next Steps

1. ✅ Read [BUNNY_SETUP_GUIDE.md](./BUNNY_SETUP_GUIDE.md)
2. ✅ Create Bunny.net account and configure Storage/Stream
3. ✅ Test with single video: `node scripts/test-bunny-upload.js 1`
4. ✅ Upload all videos: `node scripts/upload-to-bunny.js`
5. ✅ Update site: `node scripts/update-instruments-with-bunny.js`
6. ✅ Test locally: `npm run dev`
7. ✅ Monitor costs and performance for a week
8. ✅ Decide: keep Bunny.net or stay with Archive

## 💡 Tips

- Start with **Storage method** for simplicity
- Test with 3-5 videos before uploading all
- Monitor costs in Bunny.net dashboard
- Use `UniversalPlayer` to maintain Archive as fallback
- The scripts automatically skip already uploaded videos

## ⚠️ Important Notes

- **Don't delete Archive videos** until Bunny.net is fully tested
- **Backup instruments.js** before updating (script does this automatically)
- **Monitor costs** during the first week
- **Test thoroughly** before going to production

## 📧 Support

For Bunny.net issues:
- 📚 Check [BUNNY_SETUP_GUIDE.md](./BUNNY_SETUP_GUIDE.md)
- 💬 Join [Bunny.net Discord](https://bunny.net/discord)
- 📧 Email: support@bunny.net
