# 🎬 Upload Videos 16, 17, 20 to Internet Archive

## Quick Steps

### 1. Install Internet Archive CLI (if not already installed)

```bash
pip3 install internetarchive
```

Verify installation:
```bash
ia --version
```

### 2. Create .env file with your credentials

Create a `.env` file in the project root with:

```
ARCHIVE_EMAIL=your_email@archive.org
ARCHIVE_PASSWORD=your_password
```

**Don't have an account?** Sign up for FREE at https://archive.org/account/signup

### 3. Run the upload script

```bash
node scripts/upload-specific-videos.js
```

This will upload the 3 videos:
- **16 Fortepiano C. GRAF, Vienna, c. 1834.mp4** (334 MB)
- **17 Fortepiano C. GRAF, Vienna, c. 1834.mp4** (225 MB)
- **20 Fortepiano M. SCHOTT.mp4** (262 MB)

**Total**: ~821 MB

**Estimated time**: 10-30 minutes (depending on your upload speed)

### 4. Check the results

After upload completes, you'll see:
- ✅ Archive IDs for each video
- 📄 Results saved in `archive-mappings-partial.json`
- 🔗 URLs to view videos on archive.org

### 5. Update instruments.js

The script will generate identifiers like:
- `villa-medici-giulini-16-fortepiano-c-graf-vienna-c-1834`
- `villa-medici-giulini-17-fortepiano-c-graf-vienna-c-1834`
- `villa-medici-giulini-20-fortepiano-m-schott`

You'll need to update these in `app/data/instruments.js`:

```javascript
{ 
  id: 16, 
  name: "Fortepiano a coda Conrad Graf, Vienna, ca. 1834",
  audioFile: "16 Fortepiano C. GRAF, Vienna, c. 1834.mp4",
  archiveId: "villa-medici-giulini-16-fortepiano-c-graf-vienna-c-1834",
  embedUrl: "https://archive.org/embed/villa-medici-giulini-16-fortepiano-c-graf-vienna-c-1834"
},
```

## Troubleshooting

### "ia command not found"
Try:
```bash
pip install internetarchive
# or
python3 -m pip install internetarchive
```

### "Authentication failed"
Check that your `.env` file has the correct email and password.

### Upload is slow
This is normal for large files. The script shows progress and will retry on failure.

## What happens during upload?

1. ✅ Verifies ia CLI is installed
2. ✅ Configures your Internet Archive credentials
3. ✅ Checks if videos already exist (skips if yes)
4. ✅ Uploads each video with rich metadata
5. ✅ Generates Archive IDs and embed URLs
6. ✅ Saves results to `archive-mappings-partial.json`

## After Upload

Your videos will be:
- 🌍 Publicly accessible on archive.org
- 🎬 Embeddable with professional player
- 📊 Tracked with view statistics
- 🔒 Preserved forever
- 💰 100% FREE storage and bandwidth!

---

**Questions?** Check the main guide: `scripts/ARCHIVE_UPLOAD_GUIDE.md`
