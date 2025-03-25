document.addEventListener('DOMContentLoaded', function() {
    const readMoreLinks = document.querySelectorAll('.read-more');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior (if it were an <a>)
            const fullArticle = this.nextElementSibling; // Get the next sibling (full-article)

            if (fullArticle.style.display === 'none') {
                fullArticle.style.display = 'inline'; // Show the full article
                this.textContent = 'Read less'; // Change the link text
            } else {
                fullArticle.style.display = 'none'; // Hide the full article
                this.textContent = 'Read more...'; // Change the link text back
            }
        });
    });
});