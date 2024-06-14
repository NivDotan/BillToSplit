# importing cv2 
import cv2 
import pytesseract
import numpy as np
import re


#TODO: 
# 1. https://github.com/filyp/autocorrect/tree/master#adding-new-languages - add Hebrew language to the autocorrect library
# 2. https://norvig.com/spell-correct.html - implement the spell correction algorithm
# 3. https://stackoverflow.com/questions/26684982/python-spell-check-with-suggestions - implement the spell correction algorithm
# 4. https://he.wikipedia.org/wiki/Hspell - use the Hspell library for spell checking

def extract_text(image_path):
    # Load the image from file
    #image_path = 'path_to_your_image.jpg'
    image_path_text = image_path + '_text'
    image_path  = image_path + '.jpg'
    image = cv2.imread(image_path)

    # Convert the image to gray scale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Configure tesseract to use Hebrew language
    custom_config = r'--oem 3 --psm 6 -l heb'

    # Perform OCR on the image
    text = pytesseract.image_to_string(gray, config=custom_config)

    
    lines = text.split('\n')
    # Write the extracted text to a file
    with open(image_path_text+'.txt', 'w') as file:
        file.write(text)

    # Print the list of lines
    #i = 0
    #for line in lines:
    #    print(i,line)
    #    i += 1


def find_and_crop_receipt(image_path, output_path):
    # Load the image from file
    image = cv2.imread(image_path)

    # Convert the image to gray scale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use adaptive thresholding to isolate the receipt
    thresh = cv2.adaptiveThreshold(gray,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY,11,2)

    # Find contours in the thresholded image
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Check if any contours were found
    if contours:
        # Find the largest contour, assuming it's the receipt
        receipt_contour = max(contours, key=cv2.contourArea)

        # Get the bounding rectangle of the receipt contour
        x, y, w, h = cv2.boundingRect(receipt_contour)

        # Crop the image to the bounding rectangle
        cropped = image[y:y+h, x:x+w]

        # Save the cropped image
        cv2.imwrite(output_path, cropped)
    else:
        print("No contours found in the image.")

def extract_text2(image_path):
    # Load the image from file
    image_path_text = image_path + '_text'
    image_path  = image_path + '.jpg'
    image = cv2.imread(image_path)

    # Convert the image to gray scale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Reduce noise
    blur = cv2.GaussianBlur(gray, (5,5), 0)

    # Binarize the image
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Configure tesseract to use Hebrew language and LSTM engine
    custom_config = r'--oem 3 --psm 6 -l heb tessedit_char_whitelist=-'

    # Perform OCR on the image
    text = pytesseract.image_to_string(binary, config=custom_config)

    lines = text.split('\n')
    # Write the extracted text to a file
    with open(image_path_text+'.txt', 'w') as file:
        file.write(text)

def find_dashed_lines(image_path):
    # Load the image from file
    image_path_text = image_path + '_text'
    image_path  = image_path + '.jpg'
    image = cv2.imread(image_path)

    # Convert the image to gray scale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Reduce noise
    blur = cv2.GaussianBlur(gray, (5,5), 0)

    # Binarize the image
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Configure tesseract to use a configuration suitable for finding dashed lines
    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=-'

    # Perform OCR on the image
    text = pytesseract.image_to_string(binary, config=custom_config)

    lines = text.split('\n')
    dashed_lines = [line for line in lines if '--' in line]
    i = 0
    for line in lines:
        print(i,line)
        i += 1

    return dashed_lines


def find_text_between_dashed_lines(image_path):
    # Load the image from file
    image_path_text = image_path + '_text'
    image_path  = image_path + '.jpg'
    image = cv2.imread(image_path)

    # Convert the image to gray scale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Reduce noise
    blur = cv2.GaussianBlur(gray, (5,5), 0)

    # Binarize the image
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Configure tesseract to use a configuration suitable for finding dashed lines
    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=-'

    # Perform OCR on the image
    text = pytesseract.image_to_string(binary, config=custom_config)

    lines = text.split('\n')
    dashed_lines = [line for line in lines if '--' in line]

    # Configure tesseract to use Hebrew language and LSTM engine
    custom_config_heb = r'--oem 3 --psm 6 -l heb'

    # Perform OCR on the image again, this time with the Hebrew configuration
    text_heb = pytesseract.image_to_string(binary, config=custom_config_heb)

    lines_heb = text_heb.split('\n')

    # Find the indices of the dashed lines in the Hebrew text
    dashed_line_indices = [i for i, line in enumerate(lines_heb) if line in dashed_lines]

    # Print the lines between the dashed lines
    for i in range(len(dashed_line_indices) - 1):
        start = dashed_line_indices[i] + 1
        end = dashed_line_indices[i + 1]
        for j in range(start, end):
            print(lines_heb[j])

    return dashed_lines

def find_numbers(image_path):
    # Load the image from file
    image = cv2.imread(image_path)

    # Convert the image to gray scale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Reduce noise
    blur = cv2.GaussianBlur(gray, (5,5), 0)

    # Binarize the image
    _, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Configure tesseract to use a configuration suitable for finding numbers
    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789.'

    # Perform OCR on the image
    text = pytesseract.image_to_string(binary, config=custom_config)

    # Split the text into lines
    lines = text.split('\n')

    # Filter out any lines that don't contain numbers
    number_lines = [line for line in lines if any(char.isdigit() for char in line)]

    custom_config = r'--oem 3 --psm 6 -l heb tessedit_char_whitelist=-'

    # Perform OCR on the image
    text = pytesseract.image_to_string(binary, config=custom_config)
    # Split the text into lines
    lines = text.split('\n')

    # Filter out any lines that don't contain Hebrew letters
    hebrew_lines = []
    for line in lines:
        # Remove all non-Hebrew characters
        hebrew_line = re.sub(r'[^א-ת ]+', '', line)
        if hebrew_line.strip():
            hebrew_lines.append(hebrew_line)


    print(hebrew_lines)
    merged_lines = list(zip(hebrew_lines, number_lines))

    print("merged_lines: ",merged_lines)
    return merged_lines


def transform_list(input_list):
    transformed_list = []
    for item in input_list:
        text, numbers = item
        # Check if the numbers part ends with a pattern or is a whole number without decimals
        if re.search(r'\.\d{2}$', numbers) or not re.search(r'\.', numbers):
            numbers += " 1"  # Append " 1" if it ends with a pattern or is a whole number
        # Ensure there's a space after the decimal pattern followed by digits
        numbers = re.sub(r'(\d{2,}\.\d{2})(?!\d)', r'\1 ', numbers)
        # Correct cases where there's a space but no digit after the decimal pattern
        numbers = re.sub(r'(\d{2,}\.\d{2})\s+([^\d]|$)', r'\1 1', numbers)
        transformed_list.append((text, numbers))
    return transformed_list

def process_tuples(input_list):
    output_list = []
    for item, price_quantity in input_list:
        # Define a regex pattern for matching price and quantity
        match = re.match(r'(\d+\.\d\d)\s*(\d+)?', price_quantity)
        if match:
            price = match.group(1)
            quantity = match.group(2) if match.group(2) else '1'
            
            # Ensure quantity is a single digit and not greater than 9
            if int(quantity) > 9 or int(quantity) == 0:
                quantity = '1'
        else:
            # If the pattern doesn't match, default to price as is and quantity 1
            price = price_quantity
            quantity = '1'

        output_list.append((item, f"{price} {quantity}"))

    return output_list

def main():
    for i in range(5, 6):
        print(str(i) + '.jpg')
        #image_path = str(i) + '.jpg'
        #extract_text(image_path)
        #find_and_crop_receipt(image_path, 'cropped_' + image_path)
        image_path = r'..\ImgToText\Crop_image\tmp_cropped_image.png'
        #extract_text2(image_path)
        text_by_items = find_numbers(image_path)
        print(text_by_items)    
        print(transform_list(text_by_items))
        print("process_tuples", process_tuples(text_by_items))
        return process_tuples(text_by_items)

    #print(find_dashed_lines('cropped_' + image_path))
    #print(find_text_between_dashed_lines(('cropped_' + image_path)))







'''
import unicodedata

def is_rtl(char):
    return unicodedata.bidirectional(char) in ('R', 'AL')

def realign_text(text):
    lines = text.split('\n')
    for i in range(len(lines)):
        if any(is_rtl(c) for c in lines[i]):
            lines[i] = lines[i][::-1]
    return '\n'.join(lines)

print(realign_text(text))'''