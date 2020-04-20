const colorDivs = document.querySelectorAll('.color');

function generatehex() {
    const letters = '0123456789abcdef';
    let hex = '#';
    for (i = 0; i < 6; i++) {
        hex = hex + letters[Math.floor(Math.random() * 16)];
    }
    return hex;
}


function randomColors() {
    colorDivs.forEach((colorDiv, i) => {
        const hexText = colorDiv.children[0];
        const randomColor = generatehex();
        colorDiv.style.backgroundColor = randomColor;
        hexText.innerHTML = randomColor;



    });

}

randomColors();