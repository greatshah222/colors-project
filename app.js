//Global selectionandvariables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
// selecting the type only with the range and not text
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
let initialColors;
const adjustButtons = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
const lockButtons = document.querySelectorAll('.lock');


// event listener

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);

});

colorDivs.forEach((colorDiv, i) => {
    colorDiv.addEventListener('change', () => {
        updateTextUI(i);
    })

});
currentHexes.forEach(currentHex => {
    currentHex.addEventListener('click', () => {
        copyToClipboard(currentHex);
    })
});
// this below event listener is to remove the classlist of active where opacity whill be 0 and this happens after the transition ends in our css of  .copy-popup in css file 
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popupBox.classList.remove('active');
    popup.classList.remove('active');
})

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
// this is for generating button 
generateBtn.addEventListener('click', randomColors);

// this is for lock button open and close
lockButtons.forEach((lockButton, i) => {
    lockButton.addEventListener('click', e => {
        lockedPanel(e, i);
    })

});


//functions and variables 

// creating random color
// there is a first  way of generating the color using the library from chroma.js which is below  function

function generatehex() {
    const hexColor = chroma.random();
    return hexColor;
}
/*
this is the second way of generating random color

function generatehex() {
    const letters = '0123456789ABCDEF';
    let hash = '#';
    for (i = 0; i < 6; i++) {
        hash = hash + letters[Math.floor(Math.random() * 16)];

    }
    //console.log(hash);
    return hash;


}


*/



// we are trying to get the h2 from the colors so we loop over color and take the children which basicaaly is h2,div.controls and div.sliders and children 0 gives us hex
function randomColors() {
    // initialcolors 
    initialColors = [];
    colorDivs.forEach((colorDiv, i) => {
        const hexText = colorDiv.children[0];
        //console.log(hexText)
        const randomColor = generatehex();
        // here if the lock is on it means there is a classlist of locked and we dont want to add new color to that column so we make a if else statement


        // add it to initialColors aray
        //console.log(randomColor.hex());

        //console.log(initialColors)


        // add the color to the background


        if (colorDiv.classList.contains('locked')) {
            initialColors.push(hexText.innerHTML);
            return;


        } else {
            colorDiv.style.backgroundColor = randomColor;
            hexText.innerHTML = randomColor;
            initialColors.push(hexText.innerHTML);

        }



        //console.log(hexText.innerHTML)
        // check for contrast
        checkTextContrast(randomColor, hexText);
        // initial colorize sliders

        const color = chroma(randomColor);
        const icons = colorDiv.querySelectorAll('.controls button');

        for (icon of icons) {
            checkTextContrast(color, icon)
        }
        const sliders = colorDiv.querySelectorAll('.sliders input');
        // console.log(sliders)
        // gives the nodelist
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];
        //console.log(hue, brightness, saturation)
        colorizeSliders(color, hue, brightness, saturation);




    });

}

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    //console.log(luminance);
    if (luminance > 0.5) {
        text.style.color = 'black';

    } else {
        text.style.color = 'white';

    }

}
function colorizeSliders(color, hue, brightness, saturation) {

    // check the document of chroma where hsl should be passed hsl.s means saturation where 0 is low and 1 is high
    // scale saturation
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    // chroma.scale means from (nosat to color to fullsat)
    // exmaple chroma.scale(['yellow', 'red', 'black']); so from yellow to red to black
    // scale brightness
    const midBright = color.set('hsl.l', 0);
    const fullBright = color.set('hsl.l', 1);
    const scaleBright = chroma.scale([midBright, color, fullBright]);


    // update input color
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
    // here we are passing 3 scalebright parameter becuse if we pass 2 it will just give from black to white
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
    // here hue basically means start from red to green to blue to back to red so rgb to r
    // the hue goes from red to green to blue to red
    hue.style.backgroundImage = `linear-gradient(to right,rgb(204, 75, 75), rgb(204,204 ,75),rgb(75, 204, 75),rgb(75, 204, 204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;

}
function hslControls(e) {

    const index = e.target.getAttribute('data-bright') || e.target.getAttribute('data-hue') || e.target.getAttribute('data-sat');
    //console.log(index)
    // to getthe slider we go to the parent 
    // console.log(e.target.parentElement)
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    // console.log(sliders)
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor = initialColors[index]
    //console.log(bgColor);
    //console.log(hue.value);

    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);

    colorDivs[index].style.backgroundColor = color;

    // colorize input
    colorizeSliders(color, hue, brightness, saturation);








}

function updateTextUI(i) {
    console.log(colorDivs[i])
    const textHex = colorDivs[i].querySelector('h2');
    color = colorDivs[i].style.backgroundColor;
    textHex.innerHTML = chroma(color).hex();
    const icons = colorDivs[i].querySelectorAll('.controls button');
    console.log(icons)
    // check contrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
        checkTextContrast(color, icon)
    }



}

function copyToClipboard(currentHex) {
    const el = document.createElement('textarea');
    el.value = currentHex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // popup animation and for the animation we are adding active class to both and here children[0] refers to actual popup container in index.html

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

function lockedPanel(e, i) {
    const lockSVG = e.target.children[0];
    const activeBg = colorDivs[i];
    activeBg.classList.toggle('locked');

    if (lockSVG.classList.contains('fa-lock-open')) {
        e.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
        e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }


}









randomColors();
