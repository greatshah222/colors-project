const colorDivs = document.querySelectorAll('.color');
const adjustButtons = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
const sliders = document.querySelectorAll('.sliders');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-popup');
const copyContainer = document.querySelector('.copy-container');
const generateBtn = document.querySelector('.generate');
const lockBtns = document.querySelectorAll('.lock');
let initialColors;
// for local storage
let savedPalettes = [];

/*

SAVE STUFF FROM HERE FOR CONSTANT 

*/
const saveContainer = document.querySelector('.save-container');
const savePopup = document.querySelector('.save-popup');
const closeSave = document.querySelector('.close-save');
const submitSave = document.querySelector('.submit-save');
const saveBtn = document.querySelector('.save');
const saveInput = document.querySelector('.save-name')
/*

Library STUFF FROM HERE FOR CONSTANT

*/
const libraryBtn = document.querySelector('.library');
const libraryContainer = document.querySelector('.library-container');
const libraryPopup = document.querySelector('.library-popup');
const closelibraryPanel = document.querySelector('.close-library');



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
// copy to clipboard
currentHexes.forEach(currentHex => {
    currentHex.addEventListener('click', () => {
        savetoClipboard(currentHex);
    })

});
// copy to clipboard popup close 
popup.addEventListener('transitionend', () => {
    popup.classList.remove('active');
    copyContainer.classList.remove('active');

})

// generate button 
generateBtn.addEventListener('click', randomColors);

// lock button close and open 
lockBtns.forEach((lockBtn, i) => {
    lockBtn.addEventListener('click', e => {
        lockedPanel(e, i);
    })

});

// event for save Btn for opening palette
saveBtn.addEventListener('click', openPalette);
// event for save Btn for opening palette
closeSave.addEventListener('click', closePalette);
// event for save Btn for saving info from  palette
submitSave.addEventListener('click', savePalette);
// event for library Btn for opening palette
libraryBtn.addEventListener('click', openLibrary);
closelibraryPanel.addEventListener('click', closeLibrary);



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
        if (colorDiv.classList.contains('locked')) {
            initialColors.push(hexText.innerHTML);
            return;
        } else {
            hexText.innerHTML = randomColor;
            colorDiv.style.backgroundColor = randomColor;
            initialColors.push(hexText.innerHTML);
        }

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
    // reset input
    resetInputs();
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
// reset all the sliders
function resetInputs() {
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider => {
        if (slider.name === 'hue') {
            // get the color first 
            const color = initialColors[slider.getAttribute('data-hue')];
            // get the hue value then
            const hueValue = (chroma(color).hsl()[0]);
            slider.value = Math.floor(hueValue);

        } if (slider.name === 'saturation') {
            const color = initialColors[slider.getAttribute('data-sat')];
            const satValue = (chroma(color).hsl()[1]);
            // to get value between 0 and 1 and not get too many decimal point
            slider.value = Math.floor(satValue * 100) / 100;

        } if (slider.name === 'brightness') {
            const color = initialColors[slider.getAttribute('data-bright')];
            const brightValue = chroma(color).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;

        }
    });



}

// copy to clipBoard
function savetoClipboard(currentHex) {
    const el = document.createElement('textarea');
    el.value = currentHex.innerHTML;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    copyContainer.classList.add('active');
    popup.classList.add('active');


}

// for lock btn open and close 
function lockedPanel(e, i) {
    const image = e.target.children[0];
    const currentDiv = colorDivs[i];
    currentDiv.classList.toggle('locked');
    if (image.classList.contains('fa-lock-open')) {
        e.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
        e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
}
// save stuff btn 
function openPalette() {
    saveContainer.classList.add('active');
    savePopup.classList.add('active');
    saveInput.focus();

}
function closePalette() {
    saveContainer.classList.remove('active');
    savePopup.classList.remove('active');
    saveInput.value = "";
    saveInput.focus();

}
function savePalette() {
    saveContainer.classList.remove('active');
    savePopup.classList.remove('active');
    const name = saveInput.value;
    const colors = [];
    currentHexes.forEach(currentHex => {
        colors.push(currentHex.innerHTML);

    });
    let paletteNr = savedPalettes.length;
    paletteObj = { name, colors, Nr: paletteNr };
    savedPalettes.push(paletteObj);
    console.log(savedPalettes);
    // Save to local storage
    savetoLocal(paletteObj);
    saveInput.value = "";
    saveInput.focus();

    // Generate the palete for library 
    const palette = document.createElement('div');
    palette.classList.add('custom-palette');
    const title = document.createElement('h4');
    title.innerText = paletteObj.name;
    const preview = document.createElement('div');
    preview.classList.add('small-preview');
    paletteObj.colors.forEach(color => {
        const smallDiv = document.createElement('div');
        smallDiv.style.backgroundColor = color;
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement('button');
    paletteBtn.classList.add('pick-palette-btn');
    paletteBtn.classList.add(paletteObj.Nr);
    paletteBtn.innerText = 'Select';
    // Append to the library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryPopup.appendChild(palette);








}


// library
function openLibrary() {
    libraryContainer.classList.add('active');
    libraryPopup.classList.add('active');

}
function closeLibrary() {
    libraryContainer.classList.remove('active');
    libraryPopup.classList.remove('active');
}

// local storage 
function savetoLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem('palettes') === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem('palettes'));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem('palettes', JSON.stringify(localPalettes));

}
randomColors();