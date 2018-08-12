'use strict';

let score = 0, isDisabled = false, block = [3], autoLoseTimer, appearTimer, xDown, yDown;

let updateScore = function(val) {
    if (!isDisabled) document.getElementById('score').innerHTML = '<br>Score: ' + val;
}

let getHighscore = function() {
    let r = document.cookie.match(/highscore=(\d*)/);
    if (r && r.length > 1) return r[1] || 0;
    return 0;
}

let endGame = function() {
    if (!isDisabled) {
        isDisabled = true;
        if (score > getHighscore()) {
            document.cookie = 'highscore=' + score + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
            document.getElementById('highscore').innerHTML = 'New high score!';
        } else {
            document.getElementById('highscore').innerHTML = 'High score: ' + getHighscore();
        }
        document.getElementById('highscore').innerHTML += '<br>';

        appearTimer = setTimeout(() => {
            document.getElementById('highscore').style.display = '';
            appearTimer = setTimeout(() => {
                document.getElementById('refresh').style.display = '';
            }, 800);
        }, 400);
    }
}

let resetGame = function() {
    score = 0, block = [3], isDisabled = true;
    if (autoLoseTimer) clearTimeout(autoLoseTimer);
    autoLoseTimer = void 0;
    if (appearTimer) clearTimeout(appearTimer);
    appearTimer = void 0;
    
    document.getElementById('score').innerHTML = 'Score: 0';
    document.getElementById('lastmove').innerHTML = '';
    document.getElementById('highscore').innerHTML = '';
    document.getElementById('lastmove').style.display = 'none';
    document.getElementById('highscore').style.display = 'none';
    document.getElementById('refresh').style.display = 'none';

    document.getElementById('instructions').style.display = '';
    isDisabled = false;
}

let handleKey = function(e) {
    e = e || window.event;

    if (isDisabled || !e || !e.keyCode) return;
    if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 87 && e.keyCode !== 83) return;
    if (block[0] === 3) {
        block = [];
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('lastmove').style.display = '';
        updateScore(0);
    }
    
    switch(e.keyCode) {
        case 38: // up arrow
        case 87: // w
            if (document.getElementById('lastmove').innerHTML.length >= 20) {
                document.getElementById('lastmove').innerHTML = '↑';
            } else {
                document.getElementById('lastmove').innerHTML += '↑';
            }

            block.push(2);
            break;
        case 40: // down arrow
        case 83: // s
            if (document.getElementById('lastmove').innerHTML.length >= 20) {
                document.getElementById('lastmove').innerHTML = '↓';
            } else {
                document.getElementById('lastmove').innerHTML += '↓';
            }

            block.push(1);
            break;
    }

    if (autoLoseTimer) clearTimeout(autoLoseTimer);
    autoLoseTimer = setTimeout(endGame, 300);

    if ((block[0] && block[0] !== 2) || (block[1] && block[1] !== 2) || (block[2] && block[2] !== 1) || (block[3] && block[3] !== 1)) endGame();
    if (block.length >= 4) { block = []; updateScore(++score); };
}

window.addEventListener("load", function() {
    document.getElementById('wrapper2').style.display = '';

    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#efefef",
                "text": "#404040"
            },
            "button": {
                "background": "#8ec760",
                "text": "#ffffff"
            }
        },
        "content": {
            "message": "This website uses cookies to save your high score."
        }
    });
    
    document.addEventListener('touchstart', function(e) {                                         
        xDown = e.touches[0].clientX;                                      
        yDown = e.touches[0].clientY;                                      
    }, false);
    
    document.addEventListener('touchmove', function(e) {
        if (!xDown || !yDown) return;

        if (Math.abs(xDown-e.touches[0].clientX) < Math.abs(yDown-e.touches[0].clientY)) {
            if (yDown-e.touches[0].clientY > 0) {
                handleKey({'keyCode':38});
            } else { 
                handleKey({'keyCode':40});
            }                                                                 
        }

        xDown = null, yDown = null;
    }, false);

    document.addEventListener("keydown", handleKey);
});