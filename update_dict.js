import fs from 'fs/promises';

const BASE_URL = "https://www.oxfordlearnersdictionaries.com/definition/english/";
const GOOGLE_URL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=";

async function getIpa(word) {
  try {
    const res = await fetch(BASE_URL + encodeURIComponent(word.replace(/\s+/g, '-')), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Regex matches the first phon class which usually contains IPA
    const match = html.match(/<span class="phon">([^<]+)<\/span>/);
    if (match) return match[1];
    return null;
  } catch (e) {
    return null;
  }
}

async function getMeaning(word) {
  try {
    const res = await fetch(GOOGLE_URL + encodeURIComponent(word));
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0]) && data[0][0]) {
      return data[0][0][0];
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function main() {
  const filePath = './src/assets/data/oxford-5000.json';
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  
  console.log(`Bắt đầu xử lý ${data.length} từ... (Tiến trình này có thể mất hơn 1 tiếng để hoàn thành)`);
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Bỏ qua nếu từ đã có sẵn cả ipa và meaning
    if (item.ipa && item.meaning) continue;
    
    process.stdout.write(`Đang xử lý [${i+1}/${data.length}]: ${item.word}... `);
    
    if (!item.ipa) {
      item.ipa = await getIpa(item.word);
    }
    if (!item.meaning) {
      item.meaning = await getMeaning(item.word);
    }
    
    console.log(`Done (${item.ipa || 'No IPA'} | ${item.meaning || 'No Meaning'})`);
    
    // Lưu tạm vào file mỗi 10 từ để không bị mất dữ liệu nếu dừng đột ngột
    if (i % 10 === 0) {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    
    // Dừng 1.5 giây để tránh bị Oxford và Google chặn IP
    await new Promise(r => setTimeout(r, 1500));
  }
  
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log('Hoàn thành cập nhật!');
}

main();
