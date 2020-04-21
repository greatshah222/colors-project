const colorDivs = document.querySelectorAll('.color');
const gererateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
let initialColors;

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls)

});

colorDivs.forEach((colorDiv, i) => {
    colorDiv.addEventListener('change', () => updateTextUI(i));

});
function generatehex() {
    const hexColor = chroma.random();
    return hexColor;
}


function randomColors() {
    initialColors = [];
    colorDivs.forEach(colorDiv => {
        const hexText = colorDiv.children[0];
        const randomColor = generatehex();


        colorDiv.style.backgroundColor = randomColor;
        hexText.innerHTML = randomColor;
        initialColors.push(hexText.innerHTML);
        console.log(hexText.innerHTML)


        console.log(initialColors);
        checkTextContrast(randomColor, hexText);

        const color = chroma(randomColor);
        const icons = colorDiv.querySelectorAll('.controls button');

        for (icon of icons) {
            checkTextContrast(color, icon)
        }
        const sliders = colorDiv.querySelectorAll('.sliders input');
        //console.log(sliders)
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        //console.log(color)

        colorizeSliders(color, hue, brightness, saturation);

    });
}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = 'black';


    } else {
        text.style.color = 'white';

    }

}

function colorizeSliders(color, hue, brightness, saturation) {
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    const noBright = color.set('hsl.l', 0);
    const fullBright = color.set('hsl.l', 1);
    const scaleBright = chroma.scale([noBright, color, fullBright]);


    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage =
        `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right,rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;


}
function hslControls(e) {
    const index = e.target.getAttribute('data-bright') || e.target.getAttribute('data-sat') || e.target.getAttribute('data-hue');
    //console.log(index);
    const sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor = initialColors[index];
    const color = chroma(bgColor).set('hsl.h', hue.value).set('hsl.s', saturation.value).set('hsl.l', brightness.value);
    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color, hue, brightness, saturation);
}


function updateTextUI(i) {
    console.log(colorDivs[i])
    const textHex = colorDivs[i].querySelector('h2');
    color = colorDivs[i].style.backgroundColor;
    textHex.innerHTML = chroma(color).hex();
    const icons = colorDivs[i].querySelectorAll('.controls button');
    checkTextContrast(color, textHex)

    for (icon of icons) {
        checkTextContrast(color, icon)
    }

}
randomColors();