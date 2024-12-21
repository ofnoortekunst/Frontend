document.addEventListener('DOMContentLoaded', function() {
    const minInput = document.getElementById('range-min-input');
    const maxInput = document.getElementById('range-max-input');
    const rangeValues = document.getElementById('range-min');

    function updateValues() {
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);
        
        if (min > max) {
            if (this === minInput) {
                maxInput.value = min;
            } else {
                minInput.value = max;
            }
        }

        rangeValues.textContent = `${minInput.value} - ${maxInput.value}€`;
    }

    minInput.addEventListener('input', updateValues);
    maxInput.addEventListener('input', updateValues);
    
    updateValues();
}); 