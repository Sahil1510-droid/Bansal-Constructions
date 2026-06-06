// preloader.js

// 1. Create a promise for fetching and injecting the HTML
const preloaderInjected = fetch('preloader.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('afterbegin', data);
        // Returns true to signal this step is complete
        return true;
    })
    .catch(err => {
        console.error('Error loading the preloader:', err);
        return false;
    });

// 2. Create a promise for the window 'load' event
const windowLoaded = new Promise((resolve) => {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        window.addEventListener('load', resolve);
    }
});

// 3. Wait for BOTH conditions to be met before hiding the preloader
Promise.all([preloaderInjected, windowLoaded]).then(([injectedSuccessfully]) => {
    if (!injectedSuccessfully) return; // Exit if the preloader failed to load

    const preloader = document.getElementById('preloader');

    if (preloader) {
        // Add your fade-out class
        preloader.classList.add('fade-out');

        // Completely remove from layout after CSS transition finishes (500ms)
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});