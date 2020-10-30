// Init speechSynthesis API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');
const btn = document.querySelector('.talk');



//SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
    console.log('Voice Is Activated! You can speak now');
};

btn.addEventListener('click', () => {
    recognition.start();
})


recognition.onresult = function (event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    textInput.textContent = transcript;
}



//init voice array
let voices = [];

const getVoice = () => {
    voices = synth.getVoices(); // voices comming from here...

    // loop through voice and create an option for each one
    voices.forEach(voice => {
        //create option element
        const option = document.createElement('option');
        //fill the option with the voice and language
        option.textContent = voice.name + '(' + voice.lang + ')';

        //set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });

}

getVoice();

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoice;
}

//speak
const speak = () => {


    //check if speaking
    if (synth.speaking) {
        console.error('Already speaking...');
        return
    }
    if (textInput.value !== '') {

        //add background animation
        body.style.background = '#141414 url("img/wave.gif")';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%;'

        //get speak test
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        //speak and
        speakText.onend = e => {
            console.log('Done Speaking.');
            body.style.background = 'rgb(0, 1, 19)';
        }

        //speak error
        speakText.onerror = e => {
            console.error('Something went wrong.');
        }

        //select the voice
        const selectedVoice = voiceSelect.selectedOptions[0]
            .getAttribute('data-name');

        //loop through voices
        voices.forEach(voice => {
            if (voice.name == selectedVoice) {
                speakText.voice = voice;
            }
        });

        //set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //speak
        synth.speak(speakText);
    }
};

//event listeners

//text form submit

textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak(); //we created on top
    textInput.blur(); // remove the focus on text input
});



//Rate text value change
rate.addEventListener('change', e => rateValue.textContent =
    rate.value)


//Pitch text value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));


//voice select change
voiceSelect.addEventListener('change', e => speak())









