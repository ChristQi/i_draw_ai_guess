// Canvas setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const guessBtn = document.getElementById('guessBtn');
const uploadBtn = document.getElementById('uploadBtn');
const imageUpload = document.getElementById('imageUpload');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const aiGuess = document.getElementById('aiGuess');
const historyList = document.getElementById('historyList');
const colorBtns = document.querySelectorAll('.color-btn');
const brushTool = document.getElementById('brushTool');
const eraserTool = document.getElementById('eraserTool');
const dottedTool = document.getElementById('dottedTool');
const sizeIcon = document.getElementById('sizeIcon');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Mode elements
const freeModeBtn = document.getElementById('freeModeBtn');
const guessModeBtn = document.getElementById('guessModeBtn');
const targetWord = document.getElementById('targetWord');
const targetWordValue = document.getElementById('targetWordValue');
const changeWordBtn = document.getElementById('changeWordBtn');

// Modal elements
const modal = document.getElementById('imageModal');
const enlargedImage = document.getElementById('enlargedImage');
const closeModal = document.querySelector('.close');

// Guess result modal elements
const guessResultModal = document.getElementById('guessResultModal');
const guessResultTitle = document.getElementById('guessResultTitle');
const guessResultText = document.getElementById('guessResultText');
const correctAnswerText = document.getElementById('correctAnswerText');
const giftToAI = document.getElementById('giftToAI');
const unsatisfiedGuess = document.getElementById('unsatisfiedGuess');
const guessResultClose = guessResultModal.querySelector('.close');

// Feedback modal elements
const feedbackModal = document.getElementById('feedbackModal');
const feedbackGuessResult = document.getElementById('feedbackGuessResult');
const feedbackSatisfied = document.getElementById('feedbackSatisfied');
const feedbackUnsatisfied = document.getElementById('feedbackUnsatisfied');
const feedbackSkip = document.getElementById('feedbackSkip');
const feedbackClose = feedbackModal.querySelector('.close');

// Scoreboard elements
const scoreboard = document.getElementById('scoreboard');
const winRate = document.getElementById('winRate');
const totalGuesses = document.getElementById('totalGuesses');
const correctGuesses = document.getElementById('correctGuesses');
const wrongGuesses = document.getElementById('wrongGuesses');
const resetStatsBtn = document.getElementById('resetStatsBtn');
const winRateLevel = document.getElementById('winRateLevel');
const container = document.querySelector('.container');
const winRateDisplay = document.getElementById('winRateDisplay');

// Add a variable to track the last dotted point position
let lastDottedX = 0;
let lastDottedY = 0;
let needsFirstDottedPoint = true;

// 自定义光标元素
let customCursor = null;

// Game state
let currentMode = 'free'; // 'free' or 'guess'
let targetWordValueText = '苹果'; // Default target word for guess mode
let gameStats = {
    total: 0,
    correct: 0,
    wrong: 0
};

// Set canvas size to fill available space
function resizeCanvas() {
    // Get the computed style of the canvas container
    const gameArea = canvas.parentElement;
    const computedStyle = getComputedStyle(gameArea);
    
    // Calculate available width and height
    const availableWidth = gameArea.clientWidth - 
        parseFloat(computedStyle.paddingLeft) - 
        parseFloat(computedStyle.paddingRight);
    
    const availableHeight = gameArea.clientHeight - 
        parseFloat(computedStyle.paddingTop) - 
        parseFloat(computedStyle.paddingBottom);
    
    // Set canvas dimensions
    canvas.width = availableWidth;
    canvas.height = availableHeight;
    
    // Redraw the background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Initial resize
resizeCanvas();

// 创建自定义光标
function createCustomCursor() {
    customCursor = document.createElement('div');
    customCursor.className = 'cyber-cursor';
    
    // 创建中心点
    const centerDot = document.createElement('div');
    centerDot.className = 'center-dot';
    customCursor.appendChild(centerDot);
    
    document.body.appendChild(customCursor);
}

// 初始化自定义光标
createCustomCursor();

// Resize canvas when window resizes
window.addEventListener('resize', resizeCanvas);

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Tool state
let currentTool = 'brush'; // 'brush', 'eraser', or 'dotted'

// AI request state
let isAiProcessing = false;

// Initialize game stats from localStorage if available
function initGameStats() {
    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }
    updateScoreboard();
}

// Update scoreboard display
function updateScoreboard() {
    totalGuesses.textContent = gameStats.total;
    correctGuesses.textContent = gameStats.correct;
    wrongGuesses.textContent = gameStats.wrong;
    
    // Calculate win rate
    const rate = gameStats.total > 0 ? Math.round((gameStats.correct / gameStats.total) * 100) : 0;
    winRate.textContent = `${rate}%`;
    
    // Update win rate level effects
    updateWinRateLevel(rate);
}

// Calculate win rate level (1-5) based on win rate percentage
function calculateWinRateLevel(rate) {
    if (rate >= 80) return 5; // Diamond
    if (rate >= 60) return 4; // Platinum
    if (rate >= 40) return 3; // Gold
    if (rate >= 20) return 2; // Silver
    return 1; // Bronze
}

// Get level name based on level number
function getLevelName(level) {
    switch(level) {
        case 1: return '青铜';
        case 2: return '白银';
        case 3: return '黄金';
        case 4: return '铂金';
        case 5: return '钻石';
        default: return '未知';
    }
}

// Update win rate level effects
function updateWinRateLevel(rate) {
    const level = calculateWinRateLevel(rate);
    const levelName = getLevelName(level);
    
    // Update level display
    winRateLevel.className = 'win-rate-level';
    winRateLevel.classList.add(`level-${level}`);
    
    // Update container effects
    container.className = 'container';
    container.classList.add(`level-${level}`);
    
    // Update level text display
    winRateDisplay.textContent = `当前等级: ${levelName}`;
    
    // Update level display color based on level
    switch(level) {
        case 1: // Bronze
            winRateDisplay.style.color = '#cd7f32';
            winRateDisplay.style.textShadow = '0 0 10px #cd7f32, 0 0 20px #cd7f3240';
            break;
        case 2: // Silver
            winRateDisplay.style.color = '#c0c0c0';
            winRateDisplay.style.textShadow = '0 0 10px #c0c0c0, 0 0 20px #c0c0c040';
            break;
        case 3: // Gold
            winRateDisplay.style.color = '#ffd700';
            winRateDisplay.style.textShadow = '0 0 10px #ffd700, 0 0 20px #ffd70040';
            break;
        case 4: // Platinum
            winRateDisplay.style.color = '#e5e4e2';
            winRateDisplay.style.textShadow = '0 0 10px #e5e4e2, 0 0 20px #e5e4e240';
            break;
        case 5: // Diamond
            winRateDisplay.style.color = '#b9f2ff';
            winRateDisplay.style.textShadow = '0 0 10px #b9f2ff, 0 0 20px #b9f2ff40, 0 0 30px #00f0ff';
            break;
    }
}

// Save game stats to localStorage
function saveGameStats() {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
}

// Reset game stats
function resetGameStats() {
    if (confirm('确定要重置所有统计数据吗？此操作不可撤销。')) {
        gameStats = {
            total: 0,
            correct: 0,
            wrong: 0
        };
        updateScoreboard();
        saveGameStats();
        // Update win rate level effects
        updateWinRateLevel(0);
    }
}

// Update mode
function updateMode(mode) {
    currentMode = mode;
    
    // Update button states
    if (mode === 'free') {
        freeModeBtn.classList.add('active');
        guessModeBtn.classList.remove('active');
        targetWord.style.display = 'none';
    } else {
        guessModeBtn.classList.add('active');
        freeModeBtn.classList.remove('active');
        targetWord.style.display = 'block';
        // Generate a new target word for guess mode
        generateTargetWord();
    }
    
    // Reset canvas and AI guess
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    aiGuess.textContent = '请先画一些内容，然后点击"AI猜猜看"';
}

// Generate a random target word for guess mode
function generateTargetWord() {
    const words = [
        // 原有词库
        '苹果', '汽车', '猫', '房子', '太阳', '狗', '香蕉', '飞机', '鱼', '花',
        // 新增词库
        '橘子', '西瓜', '草莓',
        '鸟', '兔子', '大象', '狮子',
        '船', '自行车', '火车',
        '手机', '电脑', '书', '花瓶', '雨伞', '帽子',
        '学校', '医院', '商店', '公园',
        '眼睛', '鼻子', '嘴巴', '手', '脚',
        '月亮', '星星', '树'
    ];
    targetWordValueText = words[Math.floor(Math.random() * words.length)];
    targetWordValue.textContent = targetWordValueText;
}

// Update brush size display
brushSize.addEventListener('input', () => {
    brushSizeValue.textContent = brushSize.value;
});

// Set color from preset buttons
colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorPicker.value = btn.dataset.color;
        // Update active state
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Set initial active color button
document.querySelector(`.color-btn[data-color="${colorPicker.value}"]`).classList.add('active');

// Initialize mode
updateMode('free');

// Tool selection
brushTool.addEventListener('click', () => {
    currentTool = 'brush';
    brushTool.classList.add('active');
    eraserTool.classList.remove('active');
    dottedTool.classList.remove('active');
    canvas.style.cursor = 'crosshair';
    // Update size icon
    sizeIcon.className = 'fas fa-paintbrush';
});

eraserTool.addEventListener('click', () => {
    currentTool = 'eraser';
    eraserTool.classList.add('active');
    brushTool.classList.remove('active');
    dottedTool.classList.remove('active');
    // Set cursor to eraser icon if possible, otherwise use default
    canvas.style.cursor = 'crosshair';
    // Update size icon
    sizeIcon.className = 'fas fa-eraser';
});

dottedTool.addEventListener('click', () => {
    currentTool = 'dotted';
    dottedTool.classList.add('active');
    brushTool.classList.remove('active');
    eraserTool.classList.remove('active');
    canvas.style.cursor = 'crosshair';
    // Update size icon
    sizeIcon.className = 'fas fa-grip-lines';
});

// Function to get correct mouse position
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    };
}

// Show guess result modal with effects
function showGuessResultModal(isCorrect, guessText) {
    guessResultText.textContent = guessText;
    correctAnswerText.textContent = targetWordValueText;
    
    if (isCorrect) {
        guessResultTitle.textContent = '🎉 猜对啦！';
        guessResultTitle.style.color = 'var(--cyber-success)';
        // Add celebration effects
        createCelebrationEffect();
        // Update stats immediately for correct guess
        updateStats(true);
        // Show next question prompt
        document.querySelector('#guessResultModal .feedback-buttons').innerHTML = `
            <button id="nextQuestion" class="feedback-btn satisfied">下一道题</button>
            <button id="continueDrawing" class="feedback-btn skip">继续绘制</button>
        `;
        // Add event listeners for new buttons
        setTimeout(() => {
            document.getElementById('nextQuestion').addEventListener('click', () => {
                guessResultModal.style.display = 'none';
                // Add animation effect to canvas before clearing
                canvas.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    // Generate new target word
                    generateTargetWord();
                    // Clear the canvas
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // Reset AI guess text
                    aiGuess.textContent = '请先画一些内容，然后点击"AI猜猜看"';
                    // Reset canvas transform
                    canvas.style.transform = 'scale(1)';
                }, 200);
            });
            document.getElementById('continueDrawing').addEventListener('click', () => {
                guessResultModal.style.display = 'none';
                // Keep current target word and canvas content
            });
        }, 0);
    } else {
        guessResultTitle.textContent = '😅 猜错了';
        guessResultTitle.style.color = 'var(--cyber-error)';
        // Show original buttons for incorrect guess
        document.querySelector('#guessResultModal .feedback-buttons').innerHTML = `
            <button id="giftToAI" class="feedback-btn satisfied">这题送你了</button>
            <button id="unsatisfiedGuess" class="feedback-btn unsatisfied">不满意</button>
        `;
        // Add event listeners for original buttons
        setTimeout(() => {
            document.getElementById('giftToAI').addEventListener('click', () => {
                // Treat as correct guess
                updateStats(true);
                guessResultModal.style.display = 'none';
                // 不再生成新目标词，保持当前目标词不变
                // generateTargetWord();
            });
            document.getElementById('unsatisfiedGuess').addEventListener('click', () => {
                // Treat as incorrect guess
                updateStats(false);
                guessResultModal.style.display = 'none';
                // 不再生成新目标词，保持当前目标词不变
                // generateTargetWord();
            });
        }, 0);
    }
    
    guessResultModal.style.display = 'block';
}

// Create celebration effects for correct guess
function createCelebrationEffect() {
    // Create confetti effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }, i * 30);
    }
    
    // Add canvas celebration effect
    canvas.classList.add('celebration');
    setTimeout(() => {
        canvas.classList.remove('celebration');
    }, 2000);
}

// Function to update game stats
function updateStats(isCorrect) {
    gameStats.total++;
    if (isCorrect) {
        gameStats.correct++;
    } else {
        gameStats.wrong++;
    }
    updateScoreboard();
    saveGameStats();
}

// Function to start drawing
function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(canvas, e);
    [lastX, lastY] = [pos.x, pos.y];
    
    // Reset dotted line tracking when starting a new line
    if (currentTool === 'dotted') {
        lastDottedX = pos.x;
        lastDottedY = pos.y;
        needsFirstDottedPoint = true;
    }
}

// Show feedback modal for free mode
function showFeedbackModal(guessText) {
    feedbackGuessResult.textContent = guessText;
    feedbackModal.style.display = 'block';
}

// Function to draw
function draw(e) {
    if (!isDrawing) return;
    
    const pos = getMousePos(canvas, e);
    
    // Set drawing properties based on current tool
    if (currentTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = colorPicker.value;
        ctx.setLineDash([]); // Solid line
        ctx.lineWidth = brushSize.value;
        
        // Draw solid line
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    } else if (currentTool === 'eraser') {
        // Use direct white painting to simulate erasing
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'white';
        ctx.setLineDash([]); // Solid line for eraser
        ctx.lineWidth = brushSize.value;
        
        // Draw solid line (white) for erasing
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    } else if (currentTool === 'dotted') {
        // Improved dotted line implementation with consistent spacing
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = colorPicker.value;
        
        // Determine dot spacing based on brush size (closer spacing)
        const dotSpacing = Math.max(5, brushSize.value * 1.5);
        
        if (needsFirstDottedPoint) {
            // Always draw the first point
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, brushSize.value / 2, 0, Math.PI * 2);
            ctx.fill();
            lastDottedX = pos.x;
            lastDottedY = pos.y;
            needsFirstDottedPoint = false;
        }
        
        // Calculate distance from last dotted point
        const dx = pos.x - lastDottedX;
        const dy = pos.y - lastDottedY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Draw dots at consistent intervals
        if (distance >= dotSpacing) {
            // Calculate how many dots we should have drawn
            const numDots = Math.floor(distance / dotSpacing);
            
            // Draw the required number of dots
            for (let i = 1; i <= numDots; i++) {
                const ratio = i / numDots;
                const x = lastDottedX + dx * ratio;
                const y = lastDottedY + dy * ratio;
                
                ctx.beginPath();
                ctx.arc(x, y, brushSize.value / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Update the last dotted point position
            lastDottedX = lastDottedX + dx * (numDots / (distance / dotSpacing));
            lastDottedY = lastDottedY + dy * (numDots / (distance / dotSpacing));
        }
    }
    
    [lastX, lastY] = [pos.x, pos.y];
}

// Event listeners for feedback modal
feedbackSatisfied.addEventListener('click', () => {
    updateStats(true);
    feedbackModal.style.display = 'none';
});

feedbackUnsatisfied.addEventListener('click', () => {
    updateStats(false);
    feedbackModal.style.display = 'none';
});

feedbackSkip.addEventListener('click', () => {
    feedbackModal.style.display = 'none';
});

feedbackClose.addEventListener('click', () => {
    feedbackModal.style.display = 'none';
});

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 创建脉冲效果
function createPulseEffect(absX, absY, relX, relY) {
    const pulse = document.createElement('div');
    pulse.className = 'pulse-effect';
    // 使用绝对坐标定位在页面上
    pulse.style.left = `${absX}px`;
    pulse.style.top = `${absY}px`;
    // 使用赛博朋克风格的颜色和效果
    pulse.style.background = 'rgba(0, 240, 255, 0.6)';
    pulse.style.boxShadow = '0 0 10px var(--cyber-primary), 0 0 20px var(--cyber-primary)';
    document.body.appendChild(pulse);
    
    // 动画结束后移除元素
    setTimeout(() => {
        pulse.remove();
    }, 600);
}

// 创建长按效果
function createLongPressEffect(absX, absY, relX, relY) {
    // 创建多个脉冲效果，使用赛博朋克配色
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            const pulse = document.createElement('div');
            pulse.className = 'pulse-effect';
            // 使用绝对坐标定位在页面上
            pulse.style.left = `${absX + offsetX}px`;
            pulse.style.top = `${absY + offsetY}px`;
            // 使用品红色效果表示长按
            pulse.style.background = 'rgba(255, 0, 255, 0.6)';
            pulse.style.boxShadow = '0 0 10px var(--cyber-secondary), 0 0 20px var(--cyber-secondary)';
            document.body.appendChild(pulse);
            
            // 动画结束后移除元素
            setTimeout(() => {
                pulse.remove();
            }, 600);
        }, i * 150);
    }
    
    // 添加画布震动效果
    canvas.style.transform = 'translate(0, 0)';
    setTimeout(() => {
        canvas.style.transform = 'translate(-3px, -2px)';
        setTimeout(() => {
            canvas.style.transform = 'translate(2px, 3px)';
            setTimeout(() => {
                canvas.style.transform = 'translate(-1px, -1px)';
                setTimeout(() => {
                    canvas.style.transform = 'translate(0, 0)';
                }, 50);
            }, 50);
        }, 50);
    }, 50);
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// 添加炫酷的鼠标交互效果
// 鼠标悬停效果
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 更新自定义光标位置
    if (customCursor) {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    }
    
    // 更新悬停光晕位置
    canvas.style.setProperty('--mouse-x', `${x}px`);
    canvas.style.setProperty('--mouse-y', `${y}px`);
    
    // 添加悬停类
    canvas.classList.add('glow-hover');
    
    // 清除之前的定时器
    clearTimeout(mouseMoveTimer);
    
    // 设置新的定时器，在鼠标停止移动后移除悬停效果
    mouseMoveTimer = setTimeout(() => {
        canvas.classList.remove('glow-hover');
    }, 100);
});

// 鼠标进入画布时显示自定义光标
canvas.addEventListener('mouseenter', () => {
    if (customCursor) {
        customCursor.style.display = 'block';
    }
});

// 鼠标离开画布时隐藏自定义光标并移除悬停效果
canvas.addEventListener('mouseleave', () => {
    if (customCursor) {
        customCursor.style.display = 'none';
    }
    canvas.classList.remove('glow-hover');
});

// 鼠标点击效果
canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    
    // 添加点击效果到自定义光标
    if (customCursor) {
        customCursor.classList.add('click-effect');
        setTimeout(() => {
            customCursor.classList.remove('click-effect');
        }, 300);
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 确保点击在画布内部才创建脉冲效果
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        // 创建脉冲效果，使用绝对坐标定位在页面上
        createPulseEffect(e.clientX, e.clientY, x, y);
        
        // 设置长按定时器
        mouseDownTimer = setTimeout(() => {
            if (isMouseDown) {
                // 长按效果
                createLongPressEffect(e.clientX, e.clientY, x, y);
            }
        }, 500); // 500ms后触发长按效果
    }
});

// 鼠标释放
canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    clearTimeout(mouseDownTimer);
});

// 鼠标离开画布时也清除长按定时器
canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
    clearTimeout(mouseDownTimer);
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    aiGuess.textContent = '请先画一些内容，然后点击"AI猜猜看"';
    
    // Add animation effect
    canvas.style.transform = 'scale(0.98)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 200);
});

// Upload image
uploadBtn.addEventListener('click', () => {
    imageUpload.click();
});

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
            // Clear canvas and draw uploaded image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate dimensions to fit canvas while maintaining aspect ratio
            const maxWidth = canvas.width;
            const maxHeight = canvas.height;
            let { width, height } = img;
            
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
            
            // Center the image on canvas
            const x = (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;
            
            ctx.drawImage(img, x, y, width, height);
            
            // Reset file input
            imageUpload.value = '';
            
            // Automatically send to AI for guessing
            // Set processing state
            isAiProcessing = true;
            console.log('AI processing state set to true for uploaded image');
            aiGuess.textContent = 'AI正在识别中...';
            
            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                // Create a File object from the blob
                const file = new File([blob], "upload.png", { type: "image/png" });
                
                // Prepare FormData
                const formData = new FormData();
                formData.append('image', file);
                
                // Send to backend for AI processing
                try {
                    const response = await fetch('/guess', {
                        method: 'POST',
                        body: formData
                    });
                    
                    // Reset processing state
                    isAiProcessing = false;
                    console.log('AI processing state set to false after uploaded image processing');
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    const guessText = result.description || 'AI无法识别，请再试一次';
                    aiGuess.textContent = guessText;
                    
                    // Handle guess result based on mode
                    if (currentMode === 'guess') {
                        // In guess mode, check if AI guess matches target word
                        const isCorrect = guessText === targetWordValueText;
                        // Show result modal with effects
                        showGuessResultModal(isCorrect, guessText);
                        // Update stats will be handled by modal buttons
                    } else {
                        // In free mode, show feedback modal
                        showFeedbackModal(guessText);
                    }
                    
                    // Add to history
                    const imageData = canvas.toDataURL('image/png');
                    const timestamp = new Date().toISOString();
                    const id = Date.now(); // Generate a temporary ID for new records
                    addToHistory(imageData, guessText, timestamp, id);
                } catch (error) {
                    // Reset processing state
                    isAiProcessing = false;
                    console.log('AI processing state set to false after error in uploaded image processing');
                    
                    console.error('Error:', error);
                    aiGuess.textContent = '请求失败，请检查网络连接';
                }
            }, 'image/png');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Event listeners for mode switching
freeModeBtn.addEventListener('click', () => {
    updateMode('free');
});

guessModeBtn.addEventListener('click', () => {
    updateMode('guess');
});

// Event listener for changing target word
changeWordBtn.addEventListener('click', () => {
    generateTargetWord();
});

// Initialize game stats
initGameStats();

// Add event listener for reset stats button
resetStatsBtn.addEventListener('click', resetGameStats);

// Clear history with confirmation
clearHistoryBtn.addEventListener('click', async () => {
    // Show confirmation dialog
    if (!confirm('确定要清空所有游戏历史记录吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        const response = await fetch('/clear_history', {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Clear history display
        historyList.innerHTML = '';
    } catch (error) {
        console.error('Error clearing history:', error);
        alert('清空历史记录失败，请重试');
    }
});

// Delete single history record
function deleteHistoryRecord(id, element) {
    // Show confirmation dialog
    if (!confirm('确定要删除这条历史记录吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        // Send request to delete record
        fetch(`/delete_history/${id}`, {
            method: 'POST'
        });
        
        // Remove element from DOM
        element.remove();
    } catch (error) {
        console.error('Error deleting history record:', error);
        alert('删除历史记录失败，请重试');
    }
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Add item to history with animation
function addToHistory(imageData, guess, timestamp, id) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.dataset.id = id;
    
    const img = document.createElement('img');
    img.src = imageData;
    
    // Add click event to open modal
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the history item click
        enlargedImage.src = imageData;
        modal.style.display = 'block';
    });
    
    const content = document.createElement('div');
    content.className = 'history-content';
    content.innerHTML = `
        <strong>AI猜测:</strong> ${guess}
        <div class="history-timestamp">${formatTimestamp(timestamp)}</div>
    `;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-history-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = '删除记录';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteHistoryRecord(id, historyItem);
    });
    
    historyItem.appendChild(img);
    historyItem.appendChild(content);
    historyItem.appendChild(deleteBtn);
    historyList.prepend(historyItem);
    
    // Add animation
    historyItem.style.opacity = '0';
    historyItem.style.transform = 'translateY(20px)';
    setTimeout(() => {
        historyItem.style.transition = 'all 0.3s ease';
        historyItem.style.opacity = '1';
        historyItem.style.transform = 'translateY(0)';
    }, 10);
}

// Load history from server
async function loadHistory() {
    try {
        const response = await fetch('/history');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        const history = result.history || [];
        
        // Clear current history display
        historyList.innerHTML = '';
        
        // Add each history item to the display
        history.forEach(item => {
            addToHistory(item.image_data, item.ai_guess, item.timestamp, item.id);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Guess button functionality
guessBtn.addEventListener('click', async () => {
    // Check if AI is already processing
    if (isAiProcessing) {
        console.log('AI is already processing, showing alert');
        alert('AI正在努力思考中哦~');
        return;
    }
    
    // Set processing state
    isAiProcessing = true;
    console.log('AI processing state set to true for drawn image');
    
    // Show processing message
    aiGuess.textContent = 'AI正在识别中...';
    
    // Add animation effect to canvas
    canvas.style.transform = 'scale(0.98)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 200);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
        // Create a File object from the blob
        const file = new File([blob], "drawing.png", { type: "image/png" });
        
        // Prepare FormData
        const formData = new FormData();
        formData.append('image', file);
        
        // Send to backend for AI processing
        try {
            const response = await fetch('/guess', {
                method: 'POST',
                body: formData
            });
            
            // Reset processing state
            isAiProcessing = false;
            console.log('AI processing state set to false after drawn image processing');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            const guessText = result.description || 'AI无法识别，请再试一次';
            aiGuess.textContent = guessText;
            
            // Handle guess result based on mode
            if (currentMode === 'guess') {
                // In guess mode, check if AI guess matches target word
                const isCorrect = guessText === targetWordValueText;
                // Show result modal with effects
                showGuessResultModal(isCorrect, guessText);
                // Update stats will be handled by modal buttons
            } else {
                // In free mode, show feedback modal
                showFeedbackModal(guessText);
            }
            
            // Add to history
            const imageData = canvas.toDataURL('image/png');
            const timestamp = new Date().toISOString();
            const id = Date.now(); // Generate a temporary ID for new records
            addToHistory(imageData, guessText, timestamp, id);
        } catch (error) {
            // Reset processing state
            isAiProcessing = false;
            console.log('AI processing state set to false after error in drawn image processing');
            
            console.error('Error:', error);
            aiGuess.textContent = '请求失败，请检查网络连接';
        }
    }, 'image/png');
});

// Modal functionality
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Add event listener for image modal close button
const imageModalClose = document.querySelector('#imageModal .close');
if (imageModalClose) {
    imageModalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Event listeners for guess result modal
if (guessResultClose) {
    guessResultClose.addEventListener('click', () => {
        guessResultModal.style.display = 'none';
    });
}

// Event listener for "gift to AI" button
giftToAI.addEventListener('click', () => {
    // Treat as correct guess
    updateStats(true);
    guessResultModal.style.display = 'none';
    // 不再生成新目标词，保持当前目标词不变
    // generateTargetWord();
});

// Event listener for "unsatisfied" button
// These buttons are now created dynamically in the modal
// Event listeners are attached when the buttons are created

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
    if (e.target === guessResultModal) {
        guessResultModal.style.display = 'none';
    }
});

// Load history when page loads
window.addEventListener('load', loadHistory);