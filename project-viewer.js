const projects = {
  ofelita: {
    title: 'Manual de marca — Ofelita',
    pagesPath: 'assets/project-pages/ofelita',
    pages: 17
  },
  bts: {
    title: 'Tarjetas — BTS',
    pagesPath: 'assets/project-pages/bts',
    pages: 12
  },
  wayna: {
    title: 'Creación de logo — Wayna Spa',
    pagesPath: 'assets/project-pages/wayna',
    pages: 6
  },
  'hec-cakes': {
    title: 'Identidad de logo — Héc Cokes',
    pagesPath: 'assets/project-pages/hec-cakes',
    pages: 8
  }
};

const params = new URLSearchParams(window.location.search);
const id = params.get('id') || 'ofelita';
const project = projects[id];
const title = document.getElementById('projectTitle');
const pdfLink = document.getElementById('pdfLink');
const scrollView = document.getElementById('scrollView');
const slideView = document.getElementById('slideView');
const slideImage = document.getElementById('slideImage');
const slideCounter = document.getElementById('slideCounter');
const prevSlide = document.getElementById('prevSlide');
const nextSlide = document.getElementById('nextSlide');
const modeButtons = document.querySelectorAll('.mode-btn');
let currentPage = 1;

function pageUrl(page) {
  return `${project.pagesPath}/page-${String(page).padStart(2, '0')}.webp`;
}

if (!project) {
  document.title = 'Proyecto no encontrado — IRIVA';
  document.querySelector('.viewer-main').innerHTML = `
    <div class="viewer-error">
      <h2>Proyecto no encontrado</h2>
      <p>Regresa a la sección de proyectos para elegir una presentación disponible.</p>
    </div>`;
} else {
  document.title = `${project.title} — IRIVA`;
  title.textContent = project.title;
  pdfLink.href = "#";


  async function loadPageForPdf(page) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = pageUrl(page);
    });
  }

  async function openGeneratedPdf(event) {
    event.preventDefault();
    const popup = window.open('', '_blank');
    const originalLabel = pdfLink.textContent;
    pdfLink.textContent = 'Preparando…';
    pdfLink.setAttribute('aria-busy', 'true');

    try {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        throw new Error('No se pudo cargar el generador de PDF.');
      }

      const { jsPDF } = window.jspdf;
      let pdf = null;

      for (let page = 1; page <= project.pages; page += 1) {
        const img = await loadPageForPdf(page);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = canvas.toDataURL('image/jpeg', 0.88);
        const orientation = img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait';
        const format = [img.naturalWidth, img.naturalHeight];

        if (!pdf) {
          pdf = new jsPDF({ orientation, unit: 'px', format, hotfixes: ['px_scaling'] });
        } else {
          pdf.addPage(format, orientation);
        }
        pdf.addImage(data, 'JPEG', 0, 0, img.naturalWidth, img.naturalHeight, undefined, 'FAST');
      }

      const blobUrl = URL.createObjectURL(pdf.output('blob'));
      if (popup) {
        popup.location.href = blobUrl;
      } else {
        window.location.href = blobUrl;
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
    } catch (error) {
      if (popup) popup.close();
      console.error(error);
      alert('No se pudo generar el PDF. Inténtalo nuevamente.');
    } finally {
      pdfLink.textContent = originalLabel;
      pdfLink.removeAttribute('aria-busy');
    }
  }

  pdfLink.addEventListener('click', openGeneratedPdf);

  const fragment = document.createDocumentFragment();
  for (let page = 1; page <= project.pages; page += 1) {
    const img = document.createElement('img');
    img.className = 'pdf-page';
    img.src = pageUrl(page);
    img.alt = `${project.title}, página ${page}`;
    img.loading = page <= 2 ? 'eager' : 'lazy';
    fragment.appendChild(img);
  }
  scrollView.appendChild(fragment);

  function renderSlide() {
    slideImage.src = pageUrl(currentPage);
    slideImage.alt = `${project.title}, página ${currentPage}`;
    slideCounter.textContent = `${currentPage} / ${project.pages}`;
    prevSlide.disabled = currentPage <= 1;
    nextSlide.disabled = currentPage >= project.pages;
  }

  function setMode(mode) {
    const slides = mode === 'slides';
    scrollView.hidden = slides;
    slideView.hidden = !slides;
    modeButtons.forEach((button) => button.classList.toggle('active', button.dataset.mode === mode));
    if (slides) renderSlide();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });

  prevSlide.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderSlide();
    }
  });
  nextSlide.addEventListener('click', () => {
    if (currentPage < project.pages) {
      currentPage += 1;
      renderSlide();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (slideView.hidden) return;
    if (event.key === 'ArrowLeft' && currentPage > 1) {
      currentPage -= 1;
      renderSlide();
    }
    if (event.key === 'ArrowRight' && currentPage < project.pages) {
      currentPage += 1;
      renderSlide();
    }
    if (event.key === 'Escape') {
      window.location.href = 'index.html#proyectos';
    }
  });

  renderSlide();
}
