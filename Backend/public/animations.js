// Animations.js - Dynamic UI and Animation Functions for Skribble Game

// Animation utility functions
export class AnimationManager {
    constructor() {
        this.animationClasses = {
            fadeIn: 'fade-in',
            slideInRight: 'slide-in-right',
            slideInLeft: 'slide-in-left',
            bounce: 'bounce',
            pulse: 'pulse',
            highlight: 'highlight'
        };
    }

    // Add animation class to element with optional delay
    animateElement(element, animationClass, delay = 0) {
        if (!element) return;
        
        setTimeout(() => {
            element.classList.add(animationClass);
            
            // Remove animation class after completion
            const duration = this.getAnimationDuration(animationClass);
            setTimeout(() => {
                element.classList.remove(animationClass);
            }, duration);
        }, delay);
    }

    // Get animation duration based on class
    getAnimationDuration(animationClass) {
        const durations = {
            'fade-in': 500,
            'slide-in-right': 500,
            'slide-in-left': 500,
            'bounce': 500,
            'pulse': 2000,
            'highlight': 1000
        };
        return durations[animationClass] || 500;
    }

    // Animate multiple elements with staggered delay
    animateElements(elements, animationClass, staggerDelay = 100) {
        elements.forEach((element, index) => {
            this.animateElement(element, animationClass, index * staggerDelay);
        });
    }
}

// Drawing effects and animations
export class DrawingEffects {
    constructor() {
        this.effects = [];
    }

    // Create drawing effect animation
    createDrawingEffect(x, y, color, canvasContainer) {
        const effect = document.createElement('div');
        effect.className = 'drawing-effect';
        effect.style.left = (x - 5) + 'px';
        effect.style.top = (y - 5) + 'px';
        effect.style.width = '10px';
        effect.style.height = '10px';
        effect.style.backgroundColor = color;
        
        if (canvasContainer) {
            canvasContainer.appendChild(effect);
            
            // Remove effect after animation completes
            setTimeout(() => {
                if (effect && effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }, 600);
        }
    }

    // Create confetti effect for correct guesses
    createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
        
        // Create container for confetti
        const confettiContainer = document.createElement('div');
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.top = '0';
        confettiContainer.style.left = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            const size = Math.random() * 12 + 6;
            
            confetti.style.position = 'absolute';
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-20px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            
            // Add animation with random duration and delay
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            confetti.style.animation = `confetti ${duration}s linear ${delay}s forwards`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation completes
        setTimeout(() => {
            if (document.body.contains(confettiContainer)) {
                document.body.removeChild(confettiContainer);
            }
        }, 6000);
    }

    // Create celebration effect for round wins
    createCelebration() {
        const celebrationContainer = document.createElement('div');
        celebrationContainer.style.position = 'fixed';
        celebrationContainer.style.top = '50%';
        celebrationContainer.style.left = '50%';
        celebrationContainer.style.transform = 'translate(-50%, -50%)';
        celebrationContainer.style.pointerEvents = 'none';
        celebrationContainer.style.zIndex = '10000';
        celebrationContainer.style.fontSize = '48px';
        celebrationContainer.style.fontWeight = 'bold';
        celebrationContainer.style.color = '#4CAF50';
        celebrationContainer.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        celebrationContainer.textContent = '🎉';
        
        document.body.appendChild(celebrationContainer);
        
        // Animate celebration
        celebrationContainer.style.animation = 'celebration 2s ease-out forwards';
        
        setTimeout(() => {
            if (document.body.contains(celebrationContainer)) {
                document.body.removeChild(celebrationContainer);
            }
        }, 2000);
    }
}

// UI Animation Manager
export class UIAnimations {
    constructor() {
        this.animationManager = new AnimationManager();
    }

    // Animate message appearance
    animateMessage(messageElement, type = 'normal') {
        const animationClass = type === 'correct' ? 'bounce' : 'fade-in';
        this.animationManager.animateElement(messageElement, animationClass);
    }

    // Animate score updates
    animateScoreUpdate(scoreElement, newScore, oldScore) {
        if (newScore > oldScore) {
            scoreElement.style.animation = 'scoreIncrease 0.5s ease-out';
            setTimeout(() => {
                scoreElement.style.animation = '';
            }, 500);
        }
    }

    // Animate timer updates
    animateTimer(timerElement, timeLeft) {
        if (timeLeft <= 5) {
            timerElement.style.animation = 'timerWarning 0.5s infinite alternate';
        } else {
            timerElement.style.animation = '';
        }
    }

    // Animate canvas clear
    animateCanvasClear(canvasContainer, ctx, canvas) {
        canvasContainer.classList.add('bounce');
        
        // Create fade effect
        const fadeEffect = document.createElement('div');
        fadeEffect.style.position = 'absolute';
        fadeEffect.style.top = '0';
        fadeEffect.style.left = '0';
        fadeEffect.style.width = '100%';
        fadeEffect.style.height = '100%';
        fadeEffect.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        fadeEffect.style.borderRadius = '8px';
        fadeEffect.style.opacity = '0';
        fadeEffect.style.transition = 'opacity 0.5s ease';
        canvasContainer.appendChild(fadeEffect);
        
        // Fade in the white overlay
        setTimeout(() => {
            fadeEffect.style.opacity = '1';
        }, 50);
        
        // After fade, clear canvas and remove overlay
        setTimeout(() => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            canvasContainer.removeChild(fadeEffect);
            canvasContainer.classList.remove('bounce');
        }, 600);
    }

    // Animate word display updates
    animateWordDisplay(wordDisplay, newWord, category, difficulty) {
        wordDisplay.classList.add('bounce');
        
        setTimeout(() => {
            const categoryBadge = `<span class="category-badge category-${category}">${category}</span>`;
            const difficultyBadge = `<span class="category-badge difficulty-${difficulty}">${difficulty}</span>`;
            wordDisplay.innerHTML = `${newWord} ${categoryBadge} ${difficultyBadge}`;
            wordDisplay.classList.remove('bounce');
        }, 250);
    }

    // Animate user list updates
    animateUserList(userList, users) {
        userList.innerHTML = '';
        users.forEach((user, index) => {
            const userElement = document.createElement('div');
            userElement.textContent = user.username + (user.isDrawer ? ' (Drawing)' : '');
            userElement.id = `user-${user.id}`;
            
            if (user.isDrawer) {
                userElement.style.fontWeight = 'bold';
                userElement.style.color = '#4CAF50';
            }
            
            userList.appendChild(userElement);
            this.animationManager.animateElement(userElement, 'slide-in-right', index * 100);
        });
    }

    // Animate score board updates
    animateScoreBoard(scoreBoard, users) {
        scoreBoard.innerHTML = '';
        const sortedUsers = [...users].sort((a, b) => (b.score || 0) - (a.score || 0));
        
        sortedUsers.forEach((user, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.id = `score-${user.id}`;
            
            const nameSpan = document.createElement('span');
            nameSpan.textContent = user.username;
            
            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = user.score || 0;
            scoreSpan.className = 'user-score';
            
            // Highlight top score
            if (index === 0 && user.score > 0) {
                scoreItem.style.backgroundColor = '#f0f7f0';
                scoreItem.style.fontWeight = 'bold';
                scoreItem.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }
            
            scoreItem.appendChild(nameSpan);
            scoreItem.appendChild(scoreSpan);
            scoreBoard.appendChild(scoreItem);
            
            this.animationManager.animateElement(scoreItem, 'slide-in-left', index * 100);
        });
    }
}

// Mobile optimizations
export class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (this.isMobile) {
            this.applyMobileOptimizations();
        }
    }

    applyMobileOptimizations() {
        document.body.classList.add('mobile-device');
        
        // Optimize touch interactions
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.minHeight = '48px';
            button.style.margin = '8px 5px';
        });
        
        // Add viewport meta tag
        const metaTag = document.createElement('meta');
        metaTag.name = 'viewport';
        metaTag.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(metaTag);
        
        // Prevent pull-to-refresh
        document.body.style.overscrollBehavior = 'none';
        
        // Optimize canvas for mobile
        const canvas = document.getElementById('drawing-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 4; // Thicker lines for mobile
            }
        }
    }
}

// Game state animations
export class GameStateAnimations {
    constructor() {
        this.uiAnimations = new UIAnimations();
        this.drawingEffects = new DrawingEffects();
    }

    // Animate round start
    animateRoundStart(wordDisplay, roundInfo, drawerControls, isDrawer, word, category, difficulty, drawerUsername) {
        this.uiAnimations.animateWordDisplay(wordDisplay, word, category, difficulty);
        
        if (isDrawer) {
            drawerControls.classList.remove('hidden');
            drawerControls.classList.add('fade-in');
            roundInfo.textContent = 'You are drawing! Others are guessing.';
        } else {
            drawerControls.classList.add('hidden');
            roundInfo.textContent = `${drawerUsername} is drawing now. Guess the word!`;
        }
        
        setTimeout(() => {
            if (!drawerControls.classList.contains('hidden')) {
                drawerControls.classList.remove('fade-in');
            }
        }, 500);
    }

    // Animate correct guess
    animateCorrectGuess(messages, wordDisplay, roundInfo, username, word, userId, socketId, scores) {
        const messageElement = document.createElement('p');
        messageElement.classList.add('correct-guess');
        messageElement.textContent = `${username} guessed the word correctly: ${word}!`;
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
        
        if (userId === socketId) {
            wordDisplay.textContent = `You guessed it: ${word}!`;
            this.drawingEffects.createConfetti();
            this.drawingEffects.createCelebration();
        }
        
        roundInfo.classList.add('bounce');
        roundInfo.textContent = `${username} guessed the word correctly!`;
        
        setTimeout(() => {
            roundInfo.classList.remove('bounce');
        }, 500);
    }

    // Animate round end
    animateRoundEnd(canvasContainer, ctx, canvas, wordDisplay, roundInfo, messages, word, timeUp, scores) {
        this.uiAnimations.animateCanvasClear(canvasContainer, ctx, canvas);
        
        const messageElement = document.createElement('p');
        messageElement.classList.add('bounce');
        
        if (timeUp) {
            messageElement.style.color = '#ff5722';
            messageElement.style.fontWeight = 'bold';
            messageElement.textContent = `⏰ Time's up! The word was: ${word}`;
        } else {
            messageElement.style.color = '#4CAF50';
            messageElement.style.fontWeight = 'bold';
            messageElement.textContent = `🎉 Round ended. The word was: ${word}`;
        }
        
        messages.appendChild(messageElement);
        messages.scrollTop = messages.scrollHeight;
        
        wordDisplay.classList.add('fade-in');
        wordDisplay.textContent = '';
        
        roundInfo.classList.add('fade-in');
        roundInfo.textContent = 'Waiting for next round to start...';
        
        setTimeout(() => {
            wordDisplay.classList.remove('fade-in');
            roundInfo.classList.remove('fade-in');
            if (messageElement.classList.contains('bounce')) {
                messageElement.classList.remove('bounce');
            }
        }, 500);
    }
}

// Add CSS animations dynamically
export function addDynamicStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes confetti {
            0% { transform: translateY(0) rotate(0); }
            100% { transform: translateY(${window.innerHeight}px) rotate(360deg); }
        }
        
        @keyframes celebration {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        
        @keyframes scoreIncrease {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); color: #4CAF50; }
            100% { transform: scale(1); }
        }
        
        @keyframes timerWarning {
            0% { transform: scale(1); }
            100% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(styleElement);
}

// Initialize all animation systems
export function initializeAnimations() {
    addDynamicStyles();
    new MobileOptimizer();
    
    return {
        animationManager: new AnimationManager(),
        drawingEffects: new DrawingEffects(),
        uiAnimations: new UIAnimations(),
        gameStateAnimations: new GameStateAnimations()
    };
} 