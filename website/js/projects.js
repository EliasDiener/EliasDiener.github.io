/* ============================================
   PROJECTS.JS — Filter logic
   ============================================ */

const filterBtns  = document.querySelectorAll('.filter-btn');
const showcases   = document.querySelectorAll('.project-showcase');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    showcases.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
