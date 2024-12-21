document.addEventListener('DOMContentLoaded', () => {
  const fInput = document.getElementById('fileInput');
  const pContainer = document.getElementById('previewContainer');
  const fName = document.getElementById('fileName');
  const cBtn = document.getElementById('clearButton');
  const modal = document.getElementById('myModal');
  const cModal = document.getElementById('closeModal');
  const uImage = document.getElementById('uploadedImageModal');

  fInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = () => {
        fName.innerText = `File name: ${file.name}`;
        pContainer.innerHTML = 
          `<img src="${reader.result}" alt="Preview" id="previewImage">`;
        pContainer.style.display = 'block';
        cBtn.style.display = 'block';
      };

      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
      fInput.value = '';
    }
  });

  pContainer.addEventListener('click', () => {
    modal.style.display = 'block';
    uImage.src = document.getElementById('previewImage').src;
  });

  cModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  cBtn.addEventListener('click', () => {
    fInput.value = '';
    pContainer.style.display = 'none';
    cBtn.style.display = 'none';
    fName.innerText = '';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
