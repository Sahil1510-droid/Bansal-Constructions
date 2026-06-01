// preloader.js

// 1. Fetch and inject the preloader HTML at the top of the body automatically
fetch('preloader.html')
    .then(response => response.text())
    .then(data => {
        // Insert the preloader right at the beginning of the <body>
        document.body.insertAdjacentHTML('afterbegin', data);
    })
    .catch(err => console.error('Error loading the preloader:', err));

// 2. Hide the preloader once the rest of the page finishes loading
window.addEventListener('load', function () {
    // We use a small interval to ensure the fetched HTML has actually mounted to the DOM
    const checkExist = setInterval(function () {
        const preloader = document.getElementById('preloader');

        if (preloader) {
            preloader.classList.add('fade-out');

            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);

            clearInterval(checkExist);
        }
    }, 50); // Checks every 50ms until found, then clears itself
});