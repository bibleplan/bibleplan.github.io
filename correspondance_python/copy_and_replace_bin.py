# This is for Bin's sharing posts
import csv
import re
import os
def copy_file_contents(source_file, destination_file):
    try:
                # Extract the folder path from the destination file
        destination_folder = os.path.dirname(destination_file)
        
        # Create the folder if it doesn't exist
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)
        with open(source_file, 'r', encoding='utf-8') as source:
            with open(destination_file, 'w', encoding='utf-8') as destination:
                destination.write(source.read())
        print(f"Contents of {source_file} copied to {destination_file} successfully.")
    except FileNotFoundError:
        print("One of the files does not exist.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def find_replace_words(file_path, find_word, replace_word):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            file_contents = file.read()
        
        # Perform the find and replace
        updated_contents = file_contents.replace(find_word, replace_word)
        
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(updated_contents)
        print(f"Words replaced in {file_path} successfully.")
    except FileNotFoundError:
        print(f"File {file_path} does not exist.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
def make_string_length_3(input_str):
    if len(input_str) < 3:
        # Add leading zeros to make it three characters long
        output_str = '0' * (3 - len(input_str)) + input_str
    else:
        output_str = input_str
    return output_str

if __name__ == "__main__":
    csv_file = "matching_rows3.csv"
    from_year = "2020"
    to_year = "2022"
    try:
        with open(csv_file, 'r', newline='') as file:
            csv_reader = csv.reader(file)
            # Skip the header row if it exists
            next(csv_reader, None)

            for row in csv_reader:
                # Assuming you have four columns in the CSV: col1, col2, col3, col4
                col1, col2, col3, col4, col5, col6, col7, col8 = row
                # Perform your operations on the extracted values
                print(col4+col8)
                year4 = to_year
                year8 = from_year
                #print(col8)
                source_file = "template.md"
                print(source_file)
                destination_file = "_posts/sharing/"+year4+"/wk"+make_string_length_3(col2)+"/"+col4+"-bin.md"
                copy_file_contents(source_file, destination_file)
                
                find_word = "date: "
                replace_word = "date: "+col4
                
                find_replace_words(destination_file, find_word, replace_word)

                find_word = "weekNum: "
                replace_word = "weekNum: "+col2
                
                find_replace_words(destination_file, find_word, replace_word)   

                find_word = "dayNum: "
                replace_word = "dayNum: "+col3
                
                find_replace_words(destination_file, find_word, replace_word)   

                find_word = "permalink: "
                replace_word = "permalink: /sharing/"+year4+"/wk"+col2+"-day"+col3+"-sharing.html"
                
                find_replace_words(destination_file, find_word, replace_word)   

                find_word = "cycle: "
                replace_word = "cycle: "+year4
                
                find_replace_words(destination_file, find_word, replace_word)   

                find_word = "m_hyperlink"
                replace_word = "https://eccseattle.github.io/media/sharing/"+to_year+"/wk"+make_string_length_3(col2)+"/"+col4+"-bin.m4a"
                
                find_replace_words(destination_file, find_word, replace_word)                   

    except FileNotFoundError:
        print(f"File {csv_file} does not exist.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


