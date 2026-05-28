const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Lokasi folder
const artikelDir = path.join(__dirname, 'artikel');
const templatePath = path.join(__dirname, 'template.html');

// Baca isi template.html
const template = fs.readFileSync(templatePath, 'utf-8');

// Cari semua file .md di folder artikel
const files = fs.readdirSync(artikelDir).filter(file => file.endsWith('.md'));

if (files.length === 0) {
  console.log("Belum ada artikel (.md) di folder artikel.");
}

files.forEach(file => {
  const filePath = path.join(artikelDir, file);
  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  
  // Pisahkan meta data (judul, deskripsi, dll) dari isi konten
  const { data, content } = matter(markdownWithMeta);
  
  // Ubah konten Markdown jadi HTML
  const htmlContent = marked.parse(content);

  // Format tanggal biar rapi (contoh: 28 Mei 2026)
  let dateStr = data.date;
  if (data.date instanceof Date) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    dateStr = `${data.date.getDate()} ${months[data.date.getMonth()]} ${data.date.getFullYear()}`;
  }

  // Ganti semua penanda {{VARIABLE}} di template dengan data asli
  let finalHtml = template
    .replace(/{{TITLE}}/g, data.title || 'Artikel Rekan PDF')
    .replace(/{{DESCRIPTION}}/g, data.description || '')
    .replace(/{{KEYWORDS}}/g, data.keywords || '')
    .replace(/{{DATE}}/g, dateStr || '')
    .replace(/{{CATEGORY}}/g, data.category || 'Panduan PDF')
    .replace(/{{READ_TIME}}/g, data.read_time || '5')
    .replace('{{CONTENT}}', htmlContent);

  // Buat nama file baru (akhiran .html)
  const newFileName = file.replace('.md', '.html');
  
  // Simpan file HTML baru tersebut ke folder artikel
  fs.writeFileSync(path.join(artikelDir, newFileName), finalHtml);
  
  console.log(`✅ Berhasil membuat halaman web untuk: ${newFileName}`);
});
