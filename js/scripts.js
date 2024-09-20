// Initialize Quill editor
var quill = new Quill('#editor-container', {
    theme: 'snow'
});

// Assist in Spanish Writing
document.getElementById('assist-btn').addEventListener('click', function() {
    var text = quill.getText();
    fetch('/api/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-content').innerText = data.result;
    })
    .catch(error => console.error('Error:', error));
});

// Translate to Spanish
document.getElementById('translate-to-spanish-btn').addEventListener('click', function() {
    var text = quill.getText();
    fetch('/api/translate_to_spanish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-content').innerText = data.result;
    })
    .catch(error => console.error('Error:', error));
});

// Translate to English
document.getElementById('translate-to-english-btn').addEventListener('click', function() {
    var text = quill.getText();
    fetch('/api/translate_to_english', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-content').innerText = data.result;
    })
    .catch(error => console.error('Error:', error));
});

// Conjugate Selected Verb
document.getElementById('conjugate-btn').addEventListener('click', function() {
    var selection = quill.getSelection();
    if (selection && selection.length > 0) {
        var verb = quill.getText(selection.index, selection.length).trim();
        if (verb) {
            fetch('/api/conjugate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verb: verb })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('conjugation-content').innerText = 'Error: ' + data.error;
                } else {
                    document.getElementById('conjugation-content').innerHTML = formatConjugations(data.result);
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Please select a verb to conjugate.');
        }
    } else {
        alert('Please select a verb to conjugate.');
    }
});

// Define Selected Word
document.getElementById('define-btn').addEventListener('click', function() {
    var selection = quill.getSelection();
    if (selection && selection.length > 0) {
        var word = quill.getText(selection.index, selection.length).trim();
        if (word) {
            fetch('/api/define', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ word: word })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('definition-content').innerText = data.result;
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Please select a word to define.');
        }
    } else {
        alert('Please select a word to define.');
    }
});

// Ask a Question Modal Logic
var modal = document.getElementById('question-modal');
var btn = document.getElementById('question-btn');
var span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('submit-question').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    var query = document.getElementById('question-input').value;
    fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('response-content').innerText = data.result;
        modal.style.display = 'none';
        document.getElementById('question-input').value = ''; // Clear the input
    })
    .catch(error => console.error('Error:', error));
});

// Function to format conjugations into a table
function formatConjugations(conjugations) {
    const tenses = ['present', 'subjunctive', 'preterite', 'imperfect', 'future'];
    const persons = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'ellos/ellas/ustedes'];

    let tableHTML = '<table class="conjugation-table">';
    for (let i = 0; i < tenses.length; i += 2) {
        tableHTML += '<tr>';

        // Left cell
        let tenseLeft = tenses[i];
        tableHTML += `<td style="vertical-align: top; width: 50%;">`;
        tableHTML += `<strong>${capitalizeFirstLetter(tenseLeft)}</strong>`;
        if (conjugations[tenseLeft]) {
            tableHTML += buildConjugationList(conjugations[tenseLeft], persons);
        } else {
            tableHTML += '<p>Data not available</p>';
        }
        tableHTML += `</td>`;

        // Right cell
        let tenseRight = tenses[i + 1];
        if (tenseRight) {
            tableHTML += `<td style="vertical-align: top; width: 50%;">`;
            tableHTML += `<strong>${capitalizeFirstLetter(tenseRight)}</strong>`;
            if (conjugations[tenseRight]) {
                tableHTML += buildConjugationList(conjugations[tenseRight], persons);
            } else {
                tableHTML += '<p>Data not available</p>';
            }
            tableHTML += `</td>`;
        }

        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    return tableHTML;
}

function buildConjugationList(tenseConjugations, persons) {
    let html = '<ul>';
    for (let person of persons) {
        let conjugation = tenseConjugations[person] || 'N/A';
        html += `<li><strong>${person}:</strong> ${conjugation}</li>`;
    }
    html += '</ul>';
    return html;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
