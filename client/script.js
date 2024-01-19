const hideForm = document.getElementById('hideForm');
const hideResult = document.getElementById('hideResult');
const hideModalButton = document.getElementById('hideModalBtn');
const hideSecretImage = document.getElementById('hideSecretImg');
const hideSubmitButton = document.getElementById('hideBtnSbt');
const downloadBtn = document.getElementById('download');

const retrieveForm = document.getElementById('retrieveForm');
const retrieveResult = document.getElementById('retrieveResult');
const retrieveModalButton = document.getElementById('retrieveModalBtn');
const retrieveSecretMessage = document.getElementById('retrieveSecretMsg');
const retrieveSubmitButton = document.getElementById('retrieveBtnSbt');
const copyBtn = document.getElementById('copy');

const hideSecret = async () => {
    hideForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        hideSubmitButton.innerHTML = '<div class="spinner-border mx-1" role="status"><span class="visually-hidden">Loading...</span></div>';
        hideSubmitButton.disabled = true;
        
        const hideFormData = new FormData(hideForm);
        console.log([...hideFormData.entries()]);

        hideApiUrl = 'https://localhost:7860/hide_message';

        try {
            const res = await axios.post(hideApiUrl, hideFormData);
            console.log(res)

            hideResult.innerHTML = '<p class="text-success">Secret hidden successfully in the image!</p>';

            setTimeout(() => {
                hideResult.innerHTML = '';
            }, 5000)

            const imageData = res.data.base64_image;
            
            hideSubmitButton.innerHTML = 'Hide';
            hideSubmitButton.disabled = false;
                        
            const imageUrl = `data:image/png;base64,${imageData}`
            
            hideModalButton.click()

            hideSecretImage.src = imageUrl

            downloadImage(imageUrl);
        } catch (error) {
            console.error(error);

            hideResult.innerHTML = '<p class="text-danger">Error hiding secret. Please try again.</p>';

            setTimeout(() => {
                hideResult.innerHTML = '';
            }, 5000)

            hideSubmitButton.innerHTML = 'Hide';
            hideSubmitButton.disabled = false;
        }
    })
}

const retrieveSecret = async () => {
    retrieveForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        retrieveSubmitButton.innerHTML = '<div class="spinner-border mx-1" role="status"><span class="visually-hidden">Loading...</span></div>';
        retrieveSubmitButton.disabled = true;

        const retrieveFormData = new FormData(retrieveForm);

        retrieveApiUrl = 'https://localhost:7860/retrieve_message';

        try {
            const res = await axios.post(retrieveApiUrl, retrieveFormData);
            console.log(res)

            retrieveResult.innerHTML = `<p class="text-success">Retrieved Secret Successfully</p>`;

            setTimeout(() => {
                retrieveResult.innerHTML = '';
            }, 5000)

            const secretMessage = res.data.decoded_message;

            retrieveSubmitButton.innerHTML = 'Retrieve';
            retrieveSubmitButton.disabled = false;

            retrieveModalButton.click()

            retrieveSecretMessage.value = secretMessage;

            copyToClipboard();
        } catch (error) {
            console.error(error);
            retrieveResult.innerHTML = '<p class="text-danger">Error retrieving secret. Please try again.</p>';

            setTimeout(() => {
                retrieveResult.innerHTML = '';
            }, 5000)

            retrieveSubmitButton.innerHTML = 'Retrieve';
            retrieveSubmitButton.disabled = false;
        }
    })
}

const copyToClipboard = async () => {
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(retrieveSecretMessage.value);
            copyBtn.innerHTML = 'Copied!';
            copyBtn.disabled = true;
            setTimeout(() => {
                copyBtn.innerHTML = 'Copy';
                copyBtn.disabled = false;
            }, 2000)
            console.log('Secret copied to clipboard');
        } catch (error) {
            console.error('Error copying secret to clipboard:', error);
            copyBtn.innerHTML = 'Error Copying!';
            copyBtn.disabled = true;
            setTimeout(() => {
                copyBtn.innerHTML = 'Copy';
                copyBtn.disabled = false;
            }, 2000)
        }
    })
}

const downloadImage = async (imgurla) => {
    downloadBtn.addEventListener('click', async () => {
        try {
            const imageUrl = imgurla;
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'secret.png';
            link.click();
            console.log('Image downloaded successfully');
            downloadBtn.innerHTML = 'Downloaded';
            downloadBtn.disabled = true;
            setTimeout(() => {
                downloadBtn.innerHTML = 'Download';
                downloadBtn.disabled = false;
            }, 2000)
        } catch (error) {
            console.error('Error downloading image:', error);
            downloadBtn.innerHTML = 'Error Downloading!';
            downloadBtn.disabled = true;
            setTimeout(() => {
                downloadBtn.innerHTML = 'Download';
                downloadBtn.disabled = false;
            }, 2000)
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    hideSecret();
    retrieveSecret();
});
