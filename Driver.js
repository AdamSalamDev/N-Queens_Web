
const trailer = document.getElementById("trailer");
const board = document.querySelector('.board');
const refreshBtn = document.getElementById("Refresh");
const sizeTB = document.getElementById("SizeTextBox");
const msg = document.getElementById("msg");

var size = 8;

let lightColor = "#F1D9C0";
let darkColor = "#A97A65";

var count = 0;
var avtive = false;

msg.style.visibility = "hidden";

for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {

        
        const square = document.createElement('div');
        square.style.width = board.clientWidth / size + 'px';
        square.style.height = board.clientHeight / size + 'px';
        square.style.backgroundColor = ((row + col) % 2 != 0) ? lightColor : darkColor;
        
        board.append(square);
    }
}

size = 0;

refreshBtn.addEventListener("click", change);

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function test(text) {
    await delay(500);

    if(text == 69 || text == 420) { text += '   ;)'}

    msg.innerHTML = 'Goal found at generation: ' + text;
    size = 0;
}


async function change() {

    var data = sizeTB.value;

    if (isValidNumber(data)) {

        var wait = '';

        if(data > 40){wait = '\nThis may take several seconds, please stay on the page.'}

        msg.innerHTML = 'Calculating...' + wait;
        msg.style.visibility = "visible";

        await delay(100);

        var oldSize = size;
        size = parseInt(data);

        if (size === oldSize) { return; }

        while (board.childNodes.length > 0) {
            board.removeChild(board.firstChild);
        }

        let solver = new Solver(size);
        var state = solver.Run();
        var gen = solver.getGen();
        console.log("Goal found at generation: " + gen);


        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {

                const square = document.createElement('div');
                square.style.width = board.clientWidth / size + 'px';
                square.style.height = board.clientHeight / size + 'px';
                square.style.backgroundColor = ((row + col) % 2 != 0) ? lightColor : darkColor;

                if(col === state[row]){
                    const img = document.createElement("img");
                    img.src = "Chess_qlt45.png";
                    img.style.width = board.clientWidth / size + 'px';
                    img.style.height = board.clientHeight / size + 'px';
                    square.append(img);
                }
 
                board.append(square);
            }
        }

        test(gen);
    }
    else {
        console.log("Invalid input");
    }
}


function isValidNumber(data) {

    for (var i = 0; i < data.length; i++) {
        var char = data.charAt(i);
        if (char < '0' || char > '9') { return false;}
    }

    if (data < 4 || data > 100) {
        return false;
    }

    return true;
}



const animateTrailer = (e) => {
    const x = e.clientX - trailer.offsetWidth / 2,
        y = e.clientY - trailer.offsetHeight / 2;

    const keyframes = {
        transform: `translate(${x}px, ${y}px)`
    }

    trailer.animate(keyframes, {
        duration: 800,
        fill: "forwards"
    });
}

window.onmousemove = e => {
    animateTrailer(e);
}


