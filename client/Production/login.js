document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const accessBtn = document.getElementById("accessBtn");
    accessBtn.innerHTML = '<div class="spinner-border mx-1 text-danger" role="status"><span class="visually-hidden">Loading...</span></div>';
    accessBtn.disabled = true;

    try {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);

        const response = await axios.post("https://rohanshaw-steganography-image-v1.hf.space/save_user_data", formData);

        console.log(response.data);

        const completeUserData = {
            name: name,
            email: email,
        };

        window.location.href = "index.html";

        localStorage.setItem("userData", JSON.stringify(completeUserData));
        localStorage.setItem("isLoggedIn", true);
    } catch (error) {
        console.error("Error saving user data:", error);
    } finally {
        accessBtn.innerHTML = "Access 🔐";
        accessBtn.disabled = false;
    }
});