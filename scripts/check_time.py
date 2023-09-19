import datetime
import pytz
import pandas as pd

# Define the Pacific Time Zone (PST/PDT)
pacific_timezone = pytz.timezone('US/Pacific')

# Get the current time in the Pacific Time Zone
current_time = datetime.datetime.now(pacific_timezone)

# Get the current hour
current_hour = current_time.hour
current_day_date = current_time.strftime('%Y-%m-%d')
# Check if the current hour is between 21 (9 PM) and 8 (8 AM next day)
if current_hour >= 12:
    # If it is, calculate and return the date of the next day
    next_day = current_time + datetime.timedelta(days=1)
    next_day_date = next_day.strftime('%Y-%m-%d')
    load_date = next_day_date
else:
    load_date = current_day_date

# Load the lookup table (replace 'lookup_table.csv' with the actual file path)
lookup_table = pd.read_csv('lookup_table.csv', dtype={'item1': str})

# Update the 'date_column' variable with the correct column name from your dataset
date_column = 'date_column'  # Replace 'actual_date_column_name' with the real column name

# Get the current date (you can replace this with your method to obtain the date)
# load_date = '2023-09-18'  # Example date format (YYYY-MM-DD)

# Filter the table based on the current date
filtered_row = lookup_table[lookup_table[date_column] == load_date]

# Check if there is a matching row for the current date
if not filtered_row.empty:
    item1 = filtered_row.iloc[0]['item1']  # Assuming 'item1' is the name of the item 1 column
    item2 = filtered_row.iloc[0]['item2']  # Assuming 'item2' is the name of the item 2 column
    print(f"sharing/2022/wk{item1}/{load_date}-bin")
else:
    print(f"temp")
    
#create path to update: eccseattle.github.io/media/sharing/2022/wk090/2023-09-18-bin.m4a
#create path to update: bibleplan.github.io/_posts/sharing/2022/wk090/2023-09-18-bin.md
