const searchButton = document.querySelector('#searchButton');
const searchInput = document.querySelector('#searchInput');
const outputContainer = document.querySelector('.main-output');
let input;
searchInput.focus();

// GET THE WORD DATA

async function getTheWordData(e) {
    e.preventDefault();
    try {
        const response = await fetch(`https://dictionary-api.eliaschen.dev/api/dictionary/en/${input}`);

        if (!response.ok) {
            throw new Error(response.status);
        };

        const data = await response.json();
        // DISPLAY THE DATA
        displayTheData(data);
    } catch (e) {
        if (e.message === '404') {
            displayTheData();
        };
    };
};

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
        const outputWordForms = document.createElement('div');
        outputWordForms.classList.add('main-output-word-forms');

        if (data.pos[0] === 'verb') {
            /* let forms = [data.verbs[data.verbs.length - 1].text]; */
            let forms = [];

            for (const verbForm of data.verbs) {
                // PAST TENSE
                if (verbForm.type.includes('Past participle')) {
                    forms[1] = verbForm.type.split('Past participle')[0];
                    continue;
                } else if (verbForm.text.includes('Past participle')) {
                    forms[1] = verbForm.text.split('Past participle')[0];
                    continue;
                };

                // PAST PARTICIPLE
                if (verbForm.type.includes('Present participle')) {
                    forms[2] = verbForm.type.split('Present participle')[0];
                    continue;
                } else if (verbForm.text.includes('Present participle')) {
                    forms[2] = verbForm.text.split('Present participle')[0];
                    continue;
                };
            };

            /* const outputWordFormPresentParticle = document.createElement('h4');
            outputWordFormPresentParticle.classList.add('main-output-word-forms-text');
            outputWordFormPresentParticle.innerHTML = `present participle <span>${forms[0]}</span>`;
            const outputWordFormsDividerOne = document.createElement('hr');
            outputWordFormsDividerOne.classList.add('main-output-word-forms-divider'); */
            const outputWordFormPastTense = document.createElement('h4');
            outputWordFormPastTense.classList.add('main-output-word-forms-text');
            outputWordFormPastTense.innerHTML = `past tense <span>${forms[1]}</span>`;
            const outputWordFormsDividerTwo = document.createElement('hr');
            outputWordFormsDividerTwo.classList.add('main-output-word-forms-divider');
            const outputWordFormPastParticle = document.createElement('h4');
            outputWordFormPastParticle.classList.add('main-output-word-forms-text');
            outputWordFormPastParticle.innerHTML = `past participle <span>${forms[2]}</span>`;

            /* outputWordForms.appendChild(outputWordFormPresentParticle);
            outputWordForms.appendChild(outputWordFormsDividerOne); */
            outputWordForms.appendChild(outputWordFormPastTense);
            outputWordForms.appendChild(outputWordFormsDividerTwo);
            outputWordForms.appendChild(outputWordFormPastParticle);
        };

        console.log(data);

        outputWord.appendChild(outputWordItself);
        outputWord.appendChild(outputWordPronunciation);
        outputWord.appendChild(outputWordForms);

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
    } else {
        const outputError = document.createElement('div');
        outputError.classList.add('main-output-error');
        const outputErrorHeader = document.createElement('h1');
        outputErrorHeader.classList.add('main-output-error-header');
        outputErrorHeader.textContent = '404';
        const outputErrorPar = document.createElement('p');
        outputErrorPar.classList.add('main-output-error-paragraph');
        outputErrorPar.textContent = 'We couldn\'t find what you were looking for...';
        outputError.appendChild(outputErrorHeader);
        outputError.appendChild(outputErrorPar);

        outputContainer.appendChild(outputError);
        searchInput.value = '';
    };
};

// INITIALIZE BUTTONS
searchButton.addEventListener('click', getTheWordData);
searchInput.addEventListener('input', e => input = e.target.value.toLowerCase());