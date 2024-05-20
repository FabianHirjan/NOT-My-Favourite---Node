document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    const starsInput = document.getElementById('stars');
    const messageElement = document.getElementById('message');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const value = parseInt(star.getAttribute('data-value'));
            highlightStars(value);
            starsInput.value = value;
        });
    });

    function highlightStars(value) {
        stars.forEach(star => {
            star.classList.toggle('active', parseInt(star.getAttribute('data-value')) <= value);
        });
    }

    const addForm = document.forms["addForm"];
    addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputs = addForm.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === '' && inputs[i].type !== 'hidden') {
                messageElement.textContent = "Please fill in all fields.";
                return false;
            }
        }
        addForm.submit();
    });
});