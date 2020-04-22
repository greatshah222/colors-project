const colorDivs = document.querySelectorAll('.color');
const adjustButtons = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
const sliders = document.querySelectorAll('.sliders');
const currentHexes = document.querySelectorAll('.color h2');


let initialColors;



/*

event listener

*/

// opening sliders
adjustButtons.forEach((adjustButton, i) => {
    adjustButton.addEventListener('click', () => {
        openAdjustmentPanel(i);

    })
});
// closing sliders
closeAdjustments.forEach((closeAdjustment, i) => {
    closeAdjustment.addEventListener('click', () => {
        closeAdjustmentPanel(i);


    })

});

// slider hsl
sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);

});

// updating text uI
colorDivs.forEach((colorDiv, i) => {
    colorDiv.addEventListener('change', () => {
        updateTextUI(i);

    });


});


/*

Functions
*/
// For generating random color from Chroma
function generateHex() {
    return chroma.random();

}
// for passing random color from chroma to colorDiv
function randomColors() {
    initialColors = [];
    colorDivs.forEach((colorDiv, i) => {
        const hexText = colorDiv.children[0];
        const randomColor = generateHex();
        hexText.innerHTML = randomColor;
        colorDiv.style.backgroundColor = randomColor;
        initialColors.push(hexText.innerHTML);
        // check for contrast
        checkTextContrast(randomColor, hexText);
        // check contrast for icon 
        const icons = colorDiv.querySelectorAll('.controls button')
        for (icon of icons) {
            checkTextContrast(randomColor, icon);

        }
        // for colorizing our slider
        const color = chroma(randomColor);
        const sliders = colorDiv.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        colorizeSliders(color, hue, saturation, brightness);
    });
}

// for checking text contrast
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = 'black';

    } else {
        text.style.color = 'white';

    }
}
// Open adjustment Panel
function openAdjustmentPanel(i) {
    sliderContainers[i].classList.toggle('active');
}
// Open adjustment Panel
function closeAdjustmentPanel(i) {
    sliderContainers[i].classList.remove('active');

}
// colorize sliders
function colorizeSliders(colors, hue, saturation, brightness) {

    const noSat = chroma(colors).set('hsl.s', 0);
    const fullSat = chroma(colors).set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, colors, fullSat]);

    const noBright = chroma(colors).set('hsl.l', 0);
    const fullBright = chroma(colors).set('hsl.l', 1);
    const scaleBright = chroma.scale([noBright, colors, fullBright]);

    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage =
        `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right,rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

// control slider value 
function hslControls(e) {
    const index = e.target.getAttribute('data-sat') || e.target.getAttribute('data-bright') || e.target.getAttribute('data-hue');
    console.log(index);
    const sliders = (e.target.parentElement).querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const saturation = sliders[2];
    const brightness = sliders[1];
    const bgColor = initialColors[index];
    const color = chroma(bgColor)
        .set('hsl.h', hue.value)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color, hue, saturation, brightness)


}

// Update Text Ui
function updateTextUI(i) {

    // to change the color in hex like #ffffff not like rgb(21,21,21) we have to use chroma(color).hex(); instead of just passing color
    const activeDiv = colorDivs[i];
    const color = activeDiv.style.backgroundColor;
    const text = activeDiv.querySelector('h2');
    text.innerHTML = chroma(color).hex();
    checkTextContrast(color, text);

    const icons = activeDiv.querySelectorAll('.controls button')
    for (icon of icons) {
        checkTextContrast(color, icon);

    }



}

randomColors();