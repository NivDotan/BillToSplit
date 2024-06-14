from flask import Flask, request, jsonify, render_template, send_from_directory
import os
import base64
from get_and_parse_text import main

app = Flask(__name__)

# Ensure directories exist
os.makedirs('Crop_image', exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save-cropped-image', methods=['POST'])
def save_cropped_image():
    data = request.json
    image_data = data['imageData']
    filename = data['filename']
    file_path = os.path.join('Crop_image', filename)
    image_data = base64.b64decode(image_data.split(',')[1])

    with open(file_path, 'wb') as f:
        f.write(image_data)

    return jsonify({'message': 'Image saved successfully', 'filename': filename})

@app.route('/split-with')
def split_with():
    return render_template('split_with.html')

@app.route('/table-view')
def table_view():
    items = main()  # Assuming main() returns the required items
    return render_template('table_view.html', items=items)

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
