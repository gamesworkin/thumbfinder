const videoUrl = document.getElementById('videoUrl');
const generateBtn = document.getElementById('generateBtn');
const result = document.getElementById('result');
const thumbnailImage = document.getElementById('thumbnailImage');
const thumbnailLink = document.getElementById('thumbnailLink');
const copyBtn = document.getElementById('copyBtn');
const openBtn = document.getElementById('openBtn');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  result.classList.add('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractVimeoId(url) {
  const regex = /vimeo\.com\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractDailymotionId(url) {
  const regex = /dailymotion\.com\/video\/([^_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractPornhubId(url) {
  const regex = /viewkey=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractXVideosId(url) {
  const regex = /video(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractXHamsterId(url) {
  const regex = /videos\/([a-zA-Z0-9\-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function extractTikTokId(url) {
  const regex = /video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function generateThumbnail() {

  hideError();

  const url = videoUrl.value.trim();

  if (!url) {
    showError('Cole um link válido de vídeo.');
    return;
  }

  let thumb = '';

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {

    const id = extractYouTubeId(url);

    if (!id) {
      showError('Não foi possível identificar o vídeo do YouTube.');
      return;
    }

    thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }

  // Vimeo
  else if (url.includes('vimeo.com')) {

    const id = extractVimeoId(url);

    if (!id) {
      showError('Não foi possível identificar o vídeo do Vimeo.');
      return;
    }

    try {
      const response = await fetch(`https://vimeo.com/api/v2/video/${id}.json`);
      const data = await response.json();
      thumb = data[0].thumbnail_large;
    } catch {
      showError('Erro ao buscar thumbnail do Vimeo.');
      return;
    }
  }

  // Dailymotion
  else if (url.includes('dailymotion.com')) {

    const id = extractDailymotionId(url);

    if (!id) {
      showError('Não foi possível identificar o vídeo do Dailymotion.');
      return;
    }

    thumb = `https://www.dailymotion.com/thumbnail/video/${id}`;
  }

  // Pornhub
  else if (url.includes('pornhub.com')) {

    const id = extractPornhubId(url);

    if (!id) {
      showError('Não foi possível identificar o vídeo do Pornhub.');
      return;
    }

    thumb = `https://ei.phncdn.com/videos/${id}/thumbs_1.jpg`;
  }

  // XVideos
  else if (url.includes('xvideos.com')) {

    const id = extractXVideosId(url);

    if (!id) {
      showError('Não foi possível identificar o vídeo do XVideos.');
      return;
    }

    thumb = `https://img-hw.xvideos-cdn.com/videos/thumbs169lll/${id}.jpg`;
  }

  // XHamster
  else if (url.includes('xhamster.com')) {

    const id = extractXHamsterId(url);

    if (!id) {
      showError('Não foi possível identificar o vídeo do XHamster.');
      return;
    }

    thumb = `https://thumb-v7.xhcdn.com/a/${id}/240x180.jpg`;
  }

  // TikTok
  else if (url.includes('tiktok.com')) {

    showError('O TikTok bloqueia acesso direto às thumbnails via front-end puro. Use uma API externa para suporte completo.');
    return;
  }

  else {
    showError('Plataforma ainda não suportada.');
    return;
  }

  thumbnailImage.src = thumb;
  thumbnailLink.value = thumb;

  result.classList.remove('hidden');
}

generateBtn.addEventListener('click', generateThumbnail);

videoUrl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    generateThumbnail();
  }
});

copyBtn.addEventListener('click', async () => {

  try {
    await navigator.clipboard.writeText(thumbnailLink.value);

    copyBtn.textContent = 'Copiado!';

    setTimeout(() => {
      copyBtn.textContent = 'Copiar Link';
    }, 2000);

  } catch {
    alert('Erro ao copiar o link.');
  }

});

openBtn.addEventListener('click', () => {
  window.open(thumbnailLink.value, '_blank');
});

downloadBtn.addEventListener('click', async () => {

  try {

    const response = await fetch(thumbnailLink.value);
    const blob = await response.blob();

    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);

    a.href = objectUrl;
    a.download = 'thumbnail.jpg';

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(objectUrl);

  } catch {
    alert('Não foi possível baixar esta thumbnail.');
  }

});
