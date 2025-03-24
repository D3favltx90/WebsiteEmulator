document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('myVideo');
    const watchCountElement = document.getElementById('watchCount');
    let watchCount = 0;

    // Immediately increment count on page load
    incrementWatchCount();

    video.addEventListener('ended', function() {
        //When the video ends it automatically increments again
        incrementWatchCount();
    });

    function incrementWatchCount() {
        watchCount++;
        watchCountElement.textContent = watchCount;
    }


});