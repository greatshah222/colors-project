//Global selectionandvariables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
// selecting the type only with the range and not text
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;




//functions and variables 

// creating random color
function generatehex() {
    const letters = '0123456789ABCDEF';
    let hash = '#';
    for (i = 0; i < 6; i++) {
        hash = hash + letters[Math.floor(Math.random() * 16)];

    }
    //console.log(hash);
    return hash;


}



// there is a second way of generating the color using the library from chroma.js which is below commented function
/*
function generatehex() {
    return chroma.random();
} 
*/

// we are trying to get the h2 from the colors so we loop over color and take the children which basicaaly is h2,div.controls and div.sliders and children 0 gives us hex
function randomColors() {
    colorDivs.forEach((colorDiv, i) => {
        const hexText = colorDiv.children[0];
        const randomColor = generatehex();
        // add the color to the background

        colorDiv.style.backgroundColor = randomColor;
        hexText.innerHTML = randomColor;



    });

}
randomColors()