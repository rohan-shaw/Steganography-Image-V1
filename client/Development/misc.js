// function hideMessage() {
//     const hideResult = document.getElementById('hideResult');
//     const fileInput = document.getElementById('hideImage');
//     const secretMessageInput = document.getElementById('secretMsg');

//     const file = fileInput.files[0];
//     const secretMessage = secretMessageInput.value;

//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('secret_msg', secretMessage);

//     const xhr = new XMLHttpRequest();

//     xhr.open('POST', 'http://localhost:8000/hide_message', true);
//     xhr.setRequestHeader('accept', 'application/json');

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 const imageUrl = URL.createObjectURL(new Blob([xhr.response], { type: 'image/png' }));
//                 hideResult.innerHTML = '<p class="text-success">Secret hidden successfully in the image!</p>';
//                 console.log('Image URL:', imageUrl);
//             } else {
//                 console.error('Error:', xhr.status, xhr.statusText);
//                 hideResult.innerHTML = '<p class="text-danger">Error hiding secret. Please try again.</p>';
//             }
//         }
//     };

//     xhr.send(formData);
// }

// function retrieveMessage() {
//     const retrieveForm = document.getElementById('retrieveForm');
//     const retrieveResult = document.getElementById('retrieveResult');
    
//     const formData = new FormData(retrieveForm);

//     const xhr = new XMLHttpRequest();

//     xhr.open('POST', 'http://localhost:8000/retrieve_message', true);
//     xhr.setRequestHeader('accept', 'application/json');

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 const response = JSON.parse(xhr.responseText);
//                 retrieveResult.innerHTML = `<p class="text-success">Retrieved Secret: ${response.decoded_message}</p>`;
//             } else {
//                 retrieveResult.innerHTML = '<p class="text-danger">Error retrieving secret. Please try again.</p>';
//             }
//         }
//     };

//     xhr.send(formData);
// }
