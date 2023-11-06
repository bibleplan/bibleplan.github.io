import pandas as pd
import csv
# Load the first sheet into a DataFrame
sheet1_df = pd.read_excel('full_list.xlsx', sheet_name='2022_23')

# Load the second sheet into another DataFrame
sheet2_df = pd.read_excel('full_list.xlsx', sheet_name='2018_19')

columns_to_compare = ['C4', 'C5']

# Create a list to store matching rows
matching_rows = []

# Iterate over rows in sheet A
for index_a, row_a in sheet1_df.iterrows():
    # Iterate over rows in sheet B
        # Check if the values in the specified columns match
        if(row_a['C2'] > 0):
            matched = 0            
            for index_b, row_b in sheet2_df.iterrows():
                if all(row_a[columns_to_compare] == row_b[columns_to_compare]):
                    matching_rows.append((index_a,  row_a['C1'],row_a['C2'],row_a['C3'], index_b, row_b['C1'], row_b['C2'], row_b['C3']))
                    matched = 1                    
                    break  # Exit the inner loop if a match is found for the current row in sheet A
            if(matched==0):
                print("NOOOOOOOOOOOOOOOOOOOOOOOOMATCH")
                print(row_a['C3'])
        else:
            matching_rows.append((index_a,  row_a['C1'],row_a['C2'],row_a['C3'], 0, 0, 0, 0))

                         
            
#    if index_a > 5:
#        break

# Now, matching_rows contains pairs of row indices that match between sheets A and B
# Define the CSV file path for saving the matching row pairs
output_csv_file = 'matching_rows_w_day0_eng.csv'

# Save the matching row pairs to a CSV file
with open(output_csv_file, 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerow(['Sheet A Row Index', 'Sheet B Row Index'])  # Write header
    csv_writer.writerows(matching_rows)

print(f"Matching row pairs saved to {output_csv_file}")
