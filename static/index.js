const form = document.getElementById("application-form");

form.addEventListener("submit", (event) => {
  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Get the input values from the form
  const name = form.elements["name"].value;
  const email = form.elements["email"].value;
  const phone = form.elements["phone"].value;

  // Construct a request object with the form data
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone }),
  };

  // Send the request to the server
  fetch("/submit", request)
    .then((response) => {
      // Handle the response from the server
      console.log(response);
    })
    .catch((error) => {
      // Handle any errors that occurred during the request
      console.log(error);
    });
});
