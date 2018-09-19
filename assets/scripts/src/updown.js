'use strict';

let score = 0, isDisabled = false, block = [3], autoLoseTimer, appearTimer, xDown, yDown;
let timer = 300;

let isMobile = function() {
    let c = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|onion package(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) c = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return c;
}
if (isMobile()) timer = 600;

let hasElementOverflowed = function() {
    let e = document.getElementById('lastmove');
    return e.scrollWidth > e.offsetWidth;
}

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

let validKeys = [38,40,87,83];
let validDisabledKeys = [13];

let handleKey = function(e) {
    e = e || window.event;
    let kc = e.keyCode || e.which;

    if (!e || !kc) return;
    if (document.getElementById('refresh').style.display !== 'none') {
        if (validDisabledKeys.indexOf(kc) === -1) return;
    } else if (isDisabled) {
        return;
    } else {
        if (validKeys.indexOf(kc) === -1) return;
    }
    if (block[0] === 3) {
        block = [];
        document.getElementById('instructions').style.display = 'none';
        document.getElementById('lastmove').style.display = '';
        updateScore(0);
    }
    
    switch(kc) {
        case 38: // up arrow
        case 87: // w
            if (document.getElementById('lastmove').innerHTML.length >= 20 || hasElementOverflowed()) {
                document.getElementById('lastmove').innerHTML = '↑';
            } else {
                document.getElementById('lastmove').innerHTML += '↑';
            }

            block.push(2);
            break;
        case 40: // down arrow
        case 83: // s
            if (document.getElementById('lastmove').innerHTML.length >= 20 || hasElementOverflowed()) {
                document.getElementById('lastmove').innerHTML = '↓';
            } else {
                document.getElementById('lastmove').innerHTML += '↓';
            }

            block.push(1);
            break;
        case 13: // enter
            if (isDisabled) {
                resetGame();
                return;
            }
            break;
    }

    if (autoLoseTimer) clearTimeout(autoLoseTimer);
    autoLoseTimer = setTimeout(endGame, timer);

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