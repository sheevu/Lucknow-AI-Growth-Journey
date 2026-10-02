import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const contentPath = 'C:/Users/sheev/.gemini/antigravity/brain/e1db843e-3554-47bf-8dcf-52d9e0958be2/.system_generated/steps/22/content.md';
const content = fs.readFileSync(contentPath, 'utf8');
const match = content.match(/Box\.postStreamData\s*=\s*(\{.*?\});/s);
if (!match) {
  console.error('Failed to parse Box stream data');
  process.exit(1);
}

const data = JSON.parse(match[1]);
const folder = data['/app-api/enduserapp/shared-folder'];
const sharedFolderUrl = 'https://app.box.com/s/771q8c8ckugn6p2jxl6pbiwv1pu7u4wf';
const sharedName = '771q8c8ckugn6p2jxl6pbiwv1pu7u4wf';

const outDir = path.resolve('public/box-marketing');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const results = [];

console.log(`Starting download of ${folder.items.length} items from Box folder: ${folder.currentFolderName}`);

for (let i = 0; i < folder.items.length; i++) {
  const item = folder.items[i];
  const indexStr = String(i + 1).padStart(2, '0');
  const targetWebpName = `marketing-${indexStr}.webp`;
  const targetWebpPath = path.join(outDir, targetWebpName);

  const downloadUrl = `https://app.box.com/index.php?rm=box_download_shared_file&shared_name=${sharedName}&file_id=f_${item.id}`;
  console.log(`[${i + 1}/${folder.items.length}] Downloading: ${item.name} (${item.itemSize} bytes)...`);

  try {
    const res = await fetch(downloadUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow'
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const rawBuffer = Buffer.from(await res.arrayBuffer());

    // Convert & optimize with sharp to webp (max width 1600px, quality 85)
    const imageInstance = sharp(rawBuffer);
    const meta = await imageInstance.metadata();
    
    let pipeline = sharp(rawBuffer);
    if (meta.width && meta.width > 1600) {
      pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
    }
    
    await pipeline
      .webp({ quality: 85, effort: 4 })
      .toFile(targetWebpPath);

    const newMeta = await sharp(targetWebpPath).metadata();
    const stat = fs.statSync(targetWebpPath);

    console.log(`  -> Saved ${targetWebpName} (${newMeta.width}x${newMeta.height}, ${(stat.size / 1024).toFixed(1)} KB)`);

    results.push({
      index: i + 1,
      fileId: String(item.id),
      originalName: item.name,
      image: `/box-marketing/${targetWebpName}`,
      width: newMeta.width,
      height: newMeta.height,
      sizeBytes: stat.size
    });
  } catch (err) {
    console.error(`  Error downloading ${item.name}:`, err.message);
  }
}

const sourcesData = {
  sharedFolder: sharedFolderUrl,
  folderName: folder.currentFolderName,
  totalItems: results.length,
  fetchedAt: new Date().toISOString(),
  images: results
};

fs.writeFileSync(
  path.resolve('lib/box-marketing-sources.json'),
  JSON.stringify(sourcesData, null, 2),
  'utf8'
);

console.log(`Successfully processed ${results.length} images! Saved metadata to lib/box-marketing-sources.json`);
