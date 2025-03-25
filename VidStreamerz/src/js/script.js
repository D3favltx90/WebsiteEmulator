document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const video = document.getElementById('main-video');
    const watchCountElement = document.getElementById('watch-count');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const shareBtn = document.getElementById('share-btn');
    const saveBtn = document.getElementById('save-btn');
    const commentInput = document.getElementById('comment-input');
    const commentBtn = document.getElementById('comment-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const commentsList = document.getElementById('comments-list');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Initialize state
    let watchCount = localStorage.getItem('watchCount') ? parseInt(localStorage.getItem('watchCount')) : 0;
    let isLiked = false;
    let isDisliked = false;
    let isSaved = false;
    
    // Update watch count display
    updateWatchCount();
    
    // Video event listeners
    if (video) {
        // Auto play video when page loads
        video.autoplay = true;
        video.play().catch(error => {
            console.log('Autoplay prevented by browser:', error);
        });
        
        // Increment watch count when video starts playing for the first time
        let hasStartedPlaying = false;
        
        video.addEventListener('play', function() {
            if (!hasStartedPlaying) {
                incrementWatchCount();
                hasStartedPlaying = true;
            }
        });
        
        // Reset the flag when video ends to count a new view if watched again
        video.addEventListener('ended', function() {
            hasStartedPlaying = false;
            // Auto replay the video when it ends
            video.play();
        });
    }
    
    // Action buttons event listeners
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            if (isLiked) {
                isLiked = false;
                likeBtn.classList.remove('active');
            } else {
                isLiked = true;
                likeBtn.classList.add('active');
                
                if (isDisliked) {
                    isDisliked = false;
                    dislikeBtn.classList.remove('active');
                }
            }
        });
    }
    
    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', function() {
            if (isDisliked) {
                isDisliked = false;
                dislikeBtn.classList.remove('active');
            } else {
                isDisliked = true;
                dislikeBtn.classList.add('active');
                
                if (isLiked) {
                    isLiked = false;
                    likeBtn.classList.remove('active');
                }
            }
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // Simple implementation - just copy the URL to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('URL copied to clipboard');
            }).catch(err => {
                console.error('Could not copy URL: ', err);
            });
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            isSaved = !isSaved;
            if (isSaved) {
                saveBtn.classList.add('active');
                showNotification('Video saved to your library');
            } else {
                saveBtn.classList.remove('active');
                showNotification('Video removed from your library');
            }
        });
    }
    
    // Comment form event listeners
    if (commentInput && commentBtn && cancelBtn) {
        // Disable the comment button initially
        commentBtn.disabled = true;
        
        // Enable/disable comment button based on input
        commentInput.addEventListener('input', function() {
            commentBtn.disabled = commentInput.value.trim() === '';
        });
        
        // Handle comment submission
        commentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const commentText = commentInput.value.trim();
            
            if (commentText) {
                addComment(commentText);
                commentInput.value = '';
                commentBtn.disabled = true;
            }
        });
        
        // Handle cancel button
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            commentInput.value = '';
            commentBtn.disabled = true;
        });
    }
    
    // Search form event listener
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // In a real app, this would redirect to search results
                // For this demo, we'll just show an alert
                showNotification(`Searching for: ${searchTerm}`);
            }
        });
    }
    
    // Mobile menu toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Video card click event for homepage
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                window.location.href = `video.html?id=${videoId}`;
            }
        });
    });
    
    // Helper Functions
    function incrementWatchCount() {
        watchCount++;
        localStorage.setItem('watchCount', watchCount);
        updateWatchCount();
    }
    
    function updateWatchCount() {
        if (watchCountElement) {
            watchCountElement.textContent = formatCount(watchCount);
        }
        
        // Also update all instances of the count in cards
        const allWatchCounts = document.querySelectorAll('.video-watch-count');
        allWatchCounts.forEach(el => {
            // Each element may have its own count data
            const count = el.getAttribute('data-count') || watchCount;
            el.textContent = formatCount(count);
        });
    }
    
    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        } else {
            return count.toString();
        }
    }
    
    function formatTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            return interval + " year" + (interval > 1 ? "s" : "") + " ago";
        }
        
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + " month" + (interval > 1 ? "s" : "") + " ago";
        }
        
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + " day" + (interval > 1 ? "s" : "") + " ago";
        }
        
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
        }
        
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
        }
        
        return "Just now";
    }
    
    function addComment(text) {
        const comment = document.createElement('div');
        comment.className = 'comment';
        
        const now = new Date();
        const timeAgo = formatTimeAgo(now);
        
        comment.innerHTML = `
            <div class="user-avatar">
                <img src="images/user-avatar.jpg" alt="User Avatar" onerror="this.src='images/default-avatar.jpg'">
            </div>
            <div class="comment-content">
                <div class="comment-author">
                    You <span class="comment-time">${timeAgo}</span>
                </div>
                <div class="comment-text">${text}</div>
                <div class="comment-actions-links">
                    <div class="comment-action">
                        <i class="icon-like"></i> Like
                    </div>
                    <div class="comment-action">
                        <i class="icon-dislike"></i> Dislike
                    </div>
                    <div class="comment-action">
                        <i class="icon-reply"></i> Reply
                    </div>
                </div>
            </div>
        `;
        
        // Add the comment at the beginning of the list
        if (commentsList) {
            const firstComment = commentsList.firstChild;
            if (firstComment) {
                commentsList.insertBefore(comment, firstComment);
            } else {
                commentsList.appendChild(comment);
            }
            
            // Update comment count
            const commentsCountElement = document.getElementById('comments-count');
            if (commentsCountElement) {
                const currentCount = parseInt(commentsCountElement.textContent);
                commentsCountElement.textContent = currentCount + 1;
            }
        }
        
        showNotification('Comment added successfully');
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize comment actions
    initCommentActions();
    
    function initCommentActions() {
        // For existing comments, add click events
        document.addEventListener('click', function(e) {
            // Handle like/dislike in comments
            if (e.target.closest('.comment-action')) {
                const action = e.target.closest('.comment-action');
                action.classList.toggle('active');
                
                // If this is a like/dislike, handle the mutual exclusivity
                if (action.textContent.trim().includes('Like') || action.textContent.trim().includes('Dislike')) {
                    const commentActions = action.parentElement;
                    const otherAction = action.textContent.trim().includes('Like') 
                        ? commentActions.querySelector('.comment-action:nth-child(2)') 
                        : commentActions.querySelector('.comment-action:nth-child(1)');
                    
                    if (action.classList.contains('active') && otherAction.classList.contains('active')) {
                        otherAction.classList.remove('active');
                    }
                }
            }
        });
    }
});

// Theme toggle functionality
let darkMode = localStorage.getItem('darkMode') === 'enabled' || false;

// Apply theme on page load
if (darkMode) {
    document.body.classList.add('dark-mode');
}

// Initialize theme toggle if it exists
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', null);
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Mobile menu toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Search form submission
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // Redirect to search results page
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
}

// Notification system
function showNotification(message, type = 'info', duration = 3000, withClose = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    if (withClose) notification.classList.add('with-close');
    notification.textContent = message;
    
    // Add close button if specified
    if (withClose) {
        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => {
            notification.classList.add('animate-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        notification.appendChild(closeButton);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after delay
    if (!withClose) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    return notification;
}

// Video play functionality
const videoElements = document.querySelectorAll('.video-player');
videoElements.forEach(video => {
    if (video) {
        const playButton = video.querySelector('.play-btn');
        const videoElement = video.querySelector('video');
        
        if (playButton && videoElement) {
            // Auto play video when page loads
            videoElement.autoplay = true;
            videoElement.play().catch(error => {
                console.log('Autoplay prevented by browser:', error);
            });
            
            // Hide play button since video is playing
            if (playButton) {
                playButton.style.display = 'none';
            }
            
            playButton.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                    playButton.style.display = 'none';
                    
                    // Add to watch history
                    addToHistory(videoElement.dataset.videoId);
                } else {
                    videoElement.pause();
                    playButton.style.display = 'flex';
                }
            });
            
            videoElement.addEventListener('ended', () => {
                playButton.style.display = 'flex';
                // Auto replay the video when it ends
                videoElement.play();
                // Hide the play button again since video is playing
                playButton.style.display = 'none';
            });
            
            videoElement.addEventListener('click', () => {
                if (videoElement.paused) {
                    videoElement.play();
                    playButton.style.display = 'none';
                } else {
                    videoElement.pause();
                    playButton.style.display = 'flex';
                }
            });
        }
    }
});

// Like/Dislike functionality
const likeButtons = document.querySelectorAll('.like-btn');
const dislikeButtons = document.querySelectorAll('.dislike-btn');

likeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const videoId = this.dataset.videoId;
        const likeCount = this.querySelector('.like-count');
        
        if (this.classList.contains('active')) {
            // Unlike the video
            this.classList.remove('active');
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            removeFromLiked(videoId);
        } else {
            // Like the video
            this.classList.add('active');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            
            // If dislike is active, remove dislike
            const dislikeBtn = document.querySelector(`.dislike-btn[data-video-id="${videoId}"]`);
            if (dislikeBtn && dislikeBtn.classList.contains('active')) {
                dislikeBtn.classList.remove('active');
                const dislikeCount = dislikeBtn.querySelector('.dislike-count');
                dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
            }
            
            addToLiked(videoId);
            showNotification('Added to liked videos', 'success');
        }
    });
});

dislikeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const videoId = this.dataset.videoId;
        const dislikeCount = this.querySelector('.dislike-count');
        
        if (this.classList.contains('active')) {
            // Remove dislike
            this.classList.remove('active');
            dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
        } else {
            // Dislike the video
            this.classList.add('active');
            dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
            
            // If like is active, remove like
            const likeBtn = document.querySelector(`.like-btn[data-video-id="${videoId}"]`);
            if (likeBtn && likeBtn.classList.contains('active')) {
                likeBtn.classList.remove('active');
                const likeCount = likeBtn.querySelector('.like-count');
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
                removeFromLiked(videoId);
            }
        }
    });
});

// Save to library functionality
const saveButtons = document.querySelectorAll('.save-btn');
saveButtons.forEach(button => {
    button.addEventListener('click', function() {
        const videoId = this.dataset.videoId;
        
        if (this.classList.contains('active')) {
            // Remove from saved
            this.classList.remove('active');
            removeFromSaved(videoId);
            showNotification('Removed from saved videos', 'info');
        } else {
            // Add to saved
            this.classList.add('active');
            addToSaved(videoId);
            showNotification('Added to saved videos', 'success');
        }
    });
});

// Subscribe functionality
const subscribeButtons = document.querySelectorAll('.subscribe-btn');
subscribeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const channelId = this.dataset.channelId;
        
        if (this.classList.contains('subscribed')) {
            // Unsubscribe
            this.classList.remove('subscribed');
            this.textContent = 'Subscribe';
            unsubscribeFromChannel(channelId);
            showNotification('Unsubscribed from channel', 'info');
        } else {
            // Subscribe
            this.classList.add('subscribed');
            this.textContent = 'Subscribed';
            subscribeToChannel(channelId);
            showNotification('Subscribed to channel', 'success');
        }
    });
});

// History page functions
// Add video to watch history
function addToHistory(videoId) {
    // Get current history from localStorage
    let history = JSON.parse(localStorage.getItem('watchHistory')) || [];
    
    // Check if video already exists in history
    const existingIndex = history.findIndex(item => item.id === videoId);
    if (existingIndex !== -1) {
        // Remove existing entry
        history.splice(existingIndex, 1);
    }
    
    // Add to beginning of history with timestamp
    history.unshift({
        id: videoId,
        timestamp: new Date().getTime()
    });
    
    // Limit history size
    if (history.length > 100) {
        history = history.slice(0, 100);
    }
    
    // Save to localStorage
    localStorage.setItem('watchHistory', JSON.stringify(history));
}

// Remove video from watch history
function removeFromHistory(videoId) {
    // Get current history from localStorage
    let history = JSON.parse(localStorage.getItem('watchHistory')) || [];
    
    // Filter out the video
    history = history.filter(item => item.id !== videoId);
    
    // Save to localStorage
    localStorage.setItem('watchHistory', JSON.stringify(history));
}

// Clear all watch history
function clearHistory() {
    localStorage.removeItem('watchHistory');
}

// Library functions
// Add video to saved videos
function addToSaved(videoId) {
    // Get current saved videos from localStorage
    let saved = JSON.parse(localStorage.getItem('savedVideos')) || [];
    
    // Check if video already exists
    if (!saved.includes(videoId)) {
        saved.push(videoId);
        localStorage.setItem('savedVideos', JSON.stringify(saved));
    }
}

// Remove video from saved videos
function removeFromSaved(videoId) {
    // Get current saved videos from localStorage
    let saved = JSON.parse(localStorage.getItem('savedVideos')) || [];
    
    // Filter out the video
    saved = saved.filter(id => id !== videoId);
    
    // Save to localStorage
    localStorage.setItem('savedVideos', JSON.stringify(saved));
}

// Add video to liked videos
function addToLiked(videoId) {
    // Get current liked videos from localStorage
    let liked = JSON.parse(localStorage.getItem('likedVideos')) || [];
    
    // Check if video already exists
    if (!liked.includes(videoId)) {
        liked.push(videoId);
        localStorage.setItem('likedVideos', JSON.stringify(liked));
    }
}

// Remove video from liked videos
function removeFromLiked(videoId) {
    // Get current liked videos from localStorage
    let liked = JSON.parse(localStorage.getItem('likedVideos')) || [];
    
    // Filter out the video
    liked = liked.filter(id => id !== videoId);
    
    // Save to localStorage
    localStorage.setItem('likedVideos', JSON.stringify(liked));
}

// Subscribe to channel
function subscribeToChannel(channelId) {
    // Get current subscriptions from localStorage
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
    
    // Check if already subscribed
    if (!subscriptions.includes(channelId)) {
        subscriptions.push(channelId);
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    }
}

// Unsubscribe from channel
function unsubscribeFromChannel(channelId) {
    // Get current subscriptions from localStorage
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
    
    // Filter out the channel
    subscriptions = subscriptions.filter(id => id !== channelId);
    
    // Save to localStorage
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
}

// Check URL parameters for loading appropriate content
document.addEventListener('DOMContentLoaded', function() {
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle video page
    const videoId = urlParams.get('id');
    if (videoId && window.location.pathname.includes('video.html')) {
        loadVideo(videoId);
    }
    
    // Handle search page
    const searchQuery = urlParams.get('q');
    if (searchQuery && window.location.pathname.includes('search.html')) {
        loadSearchResults(searchQuery);
    }
    
    // Initialize lazy loading for images
    initLazyLoading();
});

// Lazy loading for images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
}

// Load video based on ID (placeholder function)
function loadVideo(videoId) {
    console.log(`Loading video with ID: ${videoId}`);
    // This would typically fetch the video data from an API
}

// Load search results (placeholder function)
function loadSearchResults(query) {
    console.log(`Searching for: ${query}`);
    document.getElementById('search-query').textContent = query;
    // This would typically fetch search results from an API
}