document.addEventListener('DOMContentLoaded', () => {
    const cameraButton = document.getElementById('cameraButton');
    const captureButton = document.getElementById('captureButton');
    const fileInput = document.getElementById('fileInput');
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    const cropButton = document.getElementById('cropButton');
    const saveButton = document.getElementById('saveButton');
    const imgToTextButton = document.getElementById('imgToTextButton');
    const ctx = canvas.getContext('2d');
    let img = new Image();
    let cropping = false;
    let startX, startY, endX, endY, isDragging = false;

    // Create an off-screen canvas
    const offScreenCanvas = document.createElement('canvas');
    const offScreenCtx = offScreenCanvas.getContext('2d');

    // Open camera
    cameraButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            captureButton.style.display = 'block';
        } catch (err) {
            console.error('Error accessing camera: ', err);
        }
    });

    // Capture photo from video
    captureButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.style.display = 'none';
        captureButton.style.display = 'none';

        // Draw the image on the off-screen canvas
        offScreenCanvas.width = canvas.width;
        offScreenCanvas.height = canvas.height;
        offScreenCtx.drawImage(video, 0, 0);
    });

    // Load and display selected image
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            img.onload = function() {
                video.style.display = 'none';
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Draw the image on the off-screen canvas
                offScreenCanvas.width = canvas.width;
                offScreenCanvas.height = canvas.height;
                offScreenCtx.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Start cropping
    cropButton.addEventListener('click', () => {
        cropping = true;
    });

    const getCanvasCoordinates = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * (canvas.width / rect.width),
            y: (clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    const startCrop = (x, y) => {
        if (cropping) {
            startX = x;
            startY = y;
            isDragging = true;
        }
    };

    const moveCrop = (x, y) => {
        if (isDragging) {
            endX = x;
            endY = y;
            const width = endX - startX;
            const height = endY - startY;

            // Clear the canvas and redraw the image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(offScreenCanvas, 0, 0);

            // Darken the entire image
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Clear the cropping rectangle area
            ctx.clearRect(startX, startY, width, height);

            // Redraw the image in the cropping rectangle area
            ctx.drawImage(offScreenCanvas, startX, startY, width, height, startX, startY, width, height);

            // Draw the cropping rectangle border
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(startX, startY, width, height);
        }
    };

    const endCrop = () => {
        if (isDragging) {
            isDragging = false;
            const width = endX - startX;
            const height = endY - startY;
            const imageData = ctx.getImageData(startX, startY, width, height);
            canvas.width = width;
            canvas.height = height;
            ctx.putImageData(imageData, 0, 0);
            cropping = false;

            // Show the IMGTOTEXT button after cropping
            imgToTextButton.style.display = 'block';
        }
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
        const coords = getCanvasCoordinates(e.clientX, e.clientY);
        startCrop(coords.x, coords.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const coords = getCanvasCoordinates(e.clientX, e.clientY);
            moveCrop(coords.x, coords.y);
        }
    });

    canvas.addEventListener('mouseup', endCrop);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
        startCrop(coords.x, coords.y);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoordinates(touch.clientX, touch.clientY);
        moveCrop(coords.x, coords.y);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        endCrop();
    });

    // Save the cropped image to the server
    saveButton.addEventListener('click', () => {
        const imageData = canvas.toDataURL();
        const filename = 'tmp_cropped_image.png';

        fetch('/save-cropped-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData, filename }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            imgToTextButton.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Navigate to the table view page
    imgToTextButton.addEventListener('click', () => {
        window.location.href = '/split-with';
    });
    
});
