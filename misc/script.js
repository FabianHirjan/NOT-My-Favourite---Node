document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');

    stars.forEach(star => {
        star.addEventListener('click', function () {
            const value = parseInt(star.getAttribute('data-value'));
            highlightStars(value);
        });
    });

    function highlightStars(value) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= value) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    const loginForm = document.forms["addForm"];

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputs = loginForm.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === '') {
                alert("Please fill in all fields.");
                return false;
            }
        }
        loginForm.submit();
    });

    $(function () {
        $(window).on("scroll", function () {
            if ($(window).scrollTop() > 50) {
                $(".header").addClass("active");
            } else {
                //remove the background property so it comes transparent again (defined in your css)
                $(".header").removeClass("active");
            }
        });
    });
});
