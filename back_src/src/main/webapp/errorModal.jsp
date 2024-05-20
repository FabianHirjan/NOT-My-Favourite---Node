<!-- The Modal -->
<div id="myModal" class="modal">

    <!-- Modal content -->
    <div class="modal-content">
        <span class="close">&times;</span>
        <p id="error-message"></p>
        <button id="error-ok-button">OK</button>
    </div>

</div>

<script>
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Get the OK button
    var okButton = document.getElementById("error-ok-button");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks on OK, redirect to the login page
    okButton.onclick = function() {
        window.location.href = "login.jsp";
    }

    // Function to show the modal and set the error message
    function showError(message) {
        document.getElementById("error-message").innerText = message;
        modal.style.display = "block";
    }
</script>