// Gemini Modal Functions
function openGemini() {
  const modal = document.getElementById('geminiModal');
  const iframe = document.getElementById('geminiIframe');
  
  // Set the iframe source when opening
  if (!iframe.src) {
    iframe.src = 'https://fantastic-bienenstitch-89f0eb.netlify.app/';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeGemini() {
  const modal = document.getElementById('geminiModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside the content
document.addEventListener('DOMContentLoaded', function() {
  const geminiModal = document.getElementById('geminiModal');
  
  if (geminiModal) {
    geminiModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeGemini();
      }
    });
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('geminiModal');
    if (modal && modal.classList.contains('active')) {
      closeGemini();
    }
  }
});