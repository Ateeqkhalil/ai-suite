// Add your project URL here
var base_url = "";

$("#ai_generator_form").submit(function (e) {

        $("#generate_error").html('');
        $("#generate_button").prop('disabled', true);
        $("#btn_ld_spin").removeClass('d-none');
        e.preventDefault();

        $.ajax({

            url: base_url + 'ai-generator-action',
            method: 'POST',
            dataType: 'Json',
            data: $("#ai_generator_form").serialize(),
            success: function (data){
                // Display Success message
                
                //$("#ai_output").html(data.content);

                if(data.error == false){
                    simulateTyping(data.content, 10);
                }else{
                    $("#generate_button").prop('disabled', false);
                    $("#btn_ld_spin").addClass('d-none');
                    $("#generate_error").html(data.message);
                }

                
            },
            error: function (data){
                // Display Error message

                $("#generate_button").prop('disabled', false);
                $("#btn_ld_spin").addClass('d-none');
                $("#generate_error").html('Someting went wrong, please try again.');
            }
        });


});


function simulateTyping(htmlText, speedMultiplier = 1) {
    const baseTypingSpeedMin = 30;
    const baseTypingSpeedMax = 70;

    // Ensure speedMultiplier is not zero or negative to avoid division by zero.
    speedMultiplier = Math.max(speedMultiplier, 0.1); // Ensure it's at least 0.1

    const typingSpeedMin = Math.max(1, baseTypingSpeedMin / speedMultiplier); // Ensure it's at least 1
    const typingSpeedMax = Math.max(1, baseTypingSpeedMax / speedMultiplier); // Ensure it's at least 1


    const aiOutputDiv = $("#ai_output");

    if (typeof htmlText !== 'string' || htmlText === null || htmlText === undefined) {
        console.error("Error: simulateTyping() called with invalid htmlText:", htmlText);
        aiOutputDiv.html("Error: Could not display message.");
        return;
    }

    let i = 0;

    const typingInterval = setInterval(() => {
        if (i < htmlText.length) {
            let randomTypingSpeed = Math.floor(Math.random() * (typingSpeedMax - typingSpeedMin + 1)) + typingSpeedMin;
            aiOutputDiv.html(htmlText.substring(0, i + 1));
            i++;
            scrollToBottom();
        } else {
            clearInterval(typingInterval);
            $('#generate_button').prop("disabled", false);
            $('#btn_ld_spin').addClass('d-none');
        }
    }, Math.random() * (typingSpeedMax - typingSpeedMin) + typingSpeedMin);
}


function scrollToBottom() {
    const aiOutputDiv = $("#ai_output");
    aiOutputDiv.scrollTop(aiOutputDiv[0].scrollHeight);
}

$("#copyOutPut").click(function () {
    var content = $("#ai_output").html(); // Get the HTML inside #ai_output
    
    var tempInput = $("<textarea>");
    $("body").append(tempInput);
    tempInput.val(content).select();
    document.execCommand("copy");
    tempInput.remove();

    alert("AI Content copied to clipboard!"); // Optional: Show alert
});

$("#downloadOutput").click(function () {
    var textContent = $("#ai_output").html(); // Get only text inside #ai_output
    var blob = new Blob([textContent], { type: "text/plain" }); // Create a text file blob
    var link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.download = "AI_Output.txt"; // Set the download filename
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});