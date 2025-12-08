const socket = io();

const checkBoxeContainer = document.getElementById('checkbox-container');

async function stateUpdate() {
    try {
        const response = await fetch('/state', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const _jsonResponse = await response.json();
        console.log(_jsonResponse.state);

        // Update all checkboxes with the fetched state
        _jsonResponse.state.forEach((isChecked, index) => {
            const elem = document.getElementById(`index-${index}`);
            if (elem) {
                elem.checked = isChecked;
            }
        });
    } catch (error) {
        console.error('Error updating state:', error);
    }
}

// Listen when data coming from the backend
socket.on('checkbox-update', ({ index, value }) => {
    const elem = document.getElementById(`index-${index}`);
    if (elem) {
        elem.checked = value;
    }
    // Fetch full state to sync all checkboxes
    stateUpdate();
});

// Create checkboxes on page load
const checkBoxes = new Array(100).fill(0);
checkBoxes.forEach((checkBoxe, index) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.id = `index-${index}`;

    input.addEventListener('change', () => {
        console.log(input.checked);
        socket.emit('checkbox-update', { index, value: input.checked });
    });

    checkBoxeContainer.append(input);
});

// Fetch initial state when page loads
stateUpdate();
