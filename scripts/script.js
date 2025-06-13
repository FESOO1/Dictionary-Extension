const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchInput');
const outputContainer = document.querySelector('.main-output');
const api = 'https://dictionary-api.eliaschen.dev/api/dictionary/en/bring';

// GET THE WORD DATA

async function getTheWordData(e) {
    try {
        const response = await fetch(`https://dictionary-api.eliaschen.dev/api/dictionary/en/something`);

        if (!response.ok) {
            throw new Error(response.status);
        };

        const data = await response.json();
        // DISPLAY THE DATA
        displayTheData(data);
    } catch (e) {
        console.error(e.name);
        console.error(Number(e.message) === 404 ? true : false);
    };
};

getTheWordData();

// DISPLAY THE DATA

function displayTheData(data) {
    // EMPTYING THE OUTPUT CONTAINER
    outputContainer.innerHTML = '';

    if (data) {
        // OUTPUT WORD
        const outputWord = document.createElement('div');
        outputWord.classList.add('main-output-word');
        const outputWordItself = document.createElement('h2');
        outputWordItself.classList.add('main-output-word-itself');
        outputWordItself.textContent = data.word;
        const outputWordPronunciation = document.createElement('div');
        outputWordPronunciation.classList.add('main-output-word-pronunciation');
        const pronunciations = { uk: undefined, us: undefined, };
        for (let i = 0; i < data.pronunciation.length; i++) {
            if (data.pronunciation[i].lang === 'us') {
                pronunciations.us = data.pronunciation[i];
            } else if (data.pronunciation[i].lang === 'uk') {
                pronunciations.uk = data.pronunciation[i];
            };
        };

        for (const pronunciation in pronunciations) {
            const pronunciationButton = document.createElement('button');
            pronunciationButton.classList.add('main-output-word-pronunciation-button');
            pronunciationButton.type = 'button';
            pronunciationButton.innerHTML = `
            <h4 class="main-output-word-pronunciation-button-text">${pronunciations[pronunciation].lang.toUpperCase()}</h4>
            <svg class="main-output-word-pronunciation-button-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M17 9C17.6254 9.81968 18 10.8634 18 12C18 13.1366 17.6254 14.1803 17 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M20 7C21.2508 8.36613 22 10.1057 22 12C22 13.8943 21.2508 15.6339 20 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        `;
            const pronunciationText = document.createElement('h4');
            pronunciationText.classList.add('main-output-word-pronunciation-text');
            pronunciationText.textContent = pronunciations[pronunciation].pron;

            outputWordPronunciation.appendChild(pronunciationButton);
            outputWordPronunciation.appendChild(pronunciationText);

            // PLAY THE AUDIO
            pronunciationButton.addEventListener('click', e => {
                const audio = document.createElement('audio');
                audio.src = pronunciations[pronunciation].url;
                audio.play();
            });
        };

        outputWord.appendChild(outputWordItself);
        outputWord.appendChild(outputWordPronunciation);

        // OUTPUT MEANINGS
        const outputMeanings = document.createElement('div');
        outputMeanings.classList.add('main-output-meanings');
        const meanings = data.definition;

        for (const meaning of meanings) {
            const outputMeaning = document.createElement('div');
            outputMeaning.classList.add('main-output-meaning');
            const outputMeaningText = document.createElement('h4');
            outputMeaningText.classList.add('main-output-meaning-text');
            outputMeaningText.textContent = `${data.word} (${meaning.pos})`;
            const outputMeaningItself = document.createElement('h4');
            outputMeaningItself.classList.add('main-output-meaning-itself');
            outputMeaningItself.textContent = meaning.text;
            outputMeaning.appendChild(outputMeaningText);
            outputMeaning.appendChild(outputMeaningItself);
            const outputMeaningExamples = document.createElement('ul');
            outputMeaningExamples.classList.add('main-output-meaning-examples');
            const examples = meaning.example;

            for (const example of examples) {
                const outputMeaningExample = document.createElement('li');
                outputMeaningExample.classList.add('main-output-meaning-example');
                outputMeaningExample.textContent = example.text;

                outputMeaningExamples.appendChild(outputMeaningExample);
            };

            outputMeanings.appendChild(outputMeaning);
            outputMeanings.appendChild(outputMeaningExamples);
        };

        // APPEND
        outputContainer.appendChild(outputWord);
        outputContainer.appendChild(outputMeanings);
    };
};