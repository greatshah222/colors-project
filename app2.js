const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const lockButtons = document.querySelectorAll('.lock');
let initialColors;
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const adjustButtons = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
// local storage and stuff
let savedPalettes = [];


// event listener

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls)

});

colorDivs.forEach((colorDiv, i) => {
    colorDiv.addEventListener('change', () => updateTextUI(i));

});

// for generate Button 
generateBtn.addEventListener('click', randomColors);

// for lock button
lockButtons.forEach((lockButton, i) => {
    lockButton.addEventListener('click', e => {
        lockedPanel(e, i);

    });

});
// for copy clipboard
currentHexes.forEach(currentHex => {
    currentHex.addEventListener('click', () => copyToClipboard(currentHex)
    );
});
// after transition end popup box close
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popupBox.classList.remove('active');
    popup.classList.remove('active');
})
// adjust button
adjustButtons.forEach((adjustButton, i) => {
    adjustButton.addEventListener('click', () => {
        openAdjustmentPanel(i);

    })

});
closeAdjustments.forEach((closeAdjustment, i) => {
    closeAdjustment.addEventListener('click', () => {
        closeAdjustmentPanel(i);



    })
});


// functions 
function generatehex() {
    const hexColor = chroma.random();
    return hexColor;
}


function randomColors() {
    initialColors = [];
    colorDivs.forEach(colorDiv => {
        const hexText = colorDiv.children[0];
        const randomColor = generatehex();
        if (colorDiv.classList.contains('locked')) {
            initialColors.push(hexText.innerHTML);

            return;

        } else {
            colorDiv.style.backgroundColor = randomColor;
            hexText.innerHTML = randomColor;
            initialColors.push(hexText.innerHTML);

        }




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

function lockedPanel(e, i) {
    lockImage = e.target.children[0];
    //console.log(lockImage)
    colorDivs[i].classList.toggle('locked');
    if (lockImage.classList.contains('fa-lock-open')) {
        e.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
        e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }







}



function copyToClipboard(currentHex) {
    const el = document.createElement('textarea');
    el.value = currentHex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const popupBox = popup.children[0];
    popupBox.classList.add('active');
    popup.classList.add('active');


}

function openAdjustmentPanel(i) {
    sliderContainers[i].classList.toggle('active');
}
function closeAdjustmentPanel(i) {
    sliderContainers[i].classList.remove('active');
}
// Implement save to palette and local storage stuff
saveBtn = document.querySelector('.save');
saveContainer = document.querySelector('.save-container');
submitSave = document.querySelector('.submit-save');
closeSave = document.querySelector('.close-save');
const saveInput = document.querySelector('.save-container input');
// event listener for save

saveBtn.addEventListener('click', openPalette);
submitSave.addEventListener('click', savePalette);
closeSave.addEventListener('click', closePalette);

// function for save 
function openPalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.add('active');
    popup.classList.add('active');
    saveInput.focus();



}

function closePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.remove('active');


}
function savePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.remove('active');
    const name = saveInput.value;
    let colors = [];
    currentHexes.forEach(currentHex => {
        colors.push(currentHex.innerText);

    });
    let paletteNr = savedPalettes.length;
    const paletteObj = { name, colors, nr: paletteNr };
    console.log(paletteObj);
    savedPalettes.push(paletteObj);
    // now we need to save to local storage
    savetoLocal(paletteObj);
    saveInput.value = "";
    saveInput.focus();


}

// actual local storage function
function savetoLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem('palettes') === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem('palettes'));
    }
    console.log(localPalettes);
    localPalettes.push(paletteObj);
    localStorage.setItem('palettes', JSON.stringify(localPalettes));

}





randomColors();