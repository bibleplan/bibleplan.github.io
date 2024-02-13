          wget -O temp.md https://raw.githubusercontent.com/2010johnlee/2010johnlee.github.io/main/temp.md
          cat temp.md
          #git config user.name "ECCRedM-Media"
          #git config user.email "ECCRedM-Media@gmail.com"          
          #if ! cmp -s xiv.md temp.md; then # if [ 1 -eq 2 ]; then
            #load the new temp.md 
            echo "temp.md is new"
            input_string=$(cat temp.md)
            formatted_string=$(echo "$input_string" | sed 's/,/ /g')
            read -r var1 var2 var3 <<< "$formatted_string"
            var1=${var1%.txt}  # trim the .txt in the filename
            var1=${var1:4}  # trim the week in the filename
            var1=${var1#"${var1%%[!0]*}"} # trim the leading zeros, if any
            echo "week#: $var1"
            echo "url: $var2"
            echo "updated time: $var3"
            #load the weekly summary content
            filename="contentfile.txt"
            #wget -O $filename $var2
            sed -i 's|本週背經經文|_**本週背經經文**_|g' contentfile.txt
            total_lines=$(wc -l < "$filename")   
            sed_cmp () {
              if [ "${#2}" -gt 5 ]; then
                sed -i "s|$1|$2|g" "$3"
                echo "sed $2"
              else
                echo "$2 is too short. Do nothing."
              fi
            }            
            # Loop over each line and update 
            for (( row_number=1; row_number<=total_lines+1; row_number++ )); do
              echo "running ${row_number} out of ${total_lines}"
              # Skip every 4th row
              if [ $((row_number % 4)) -eq 0 ]; then
                continue
              fi
              weeks_to_add=$var1
              week_with_zeros=$(printf "%03d" "$var1")
              days_to_add=$((row_number/4+1))
              m_date=$(date -d "2024-01-01 + $((weeks_to_add-1)) week + $((days_to_add-1)) days" +"%Y-%m-%d")
              wkly_date=$(date -d "2023-12-31 + $weeks_to_add week" +"%Y-%m-%d")
              row=$(awk "NR == $row_number" "$filename")
              row=$(echo "$row" | tr -d '\r') # remove carriage return symbol
              reciterow=$(grep "本週背經經文" "$filename")
              reciterow=$(echo "$reciterow" | sed 's/（_\*\*本週背經經文\*\*_）//g')
              reciterow=$(echo "$reciterow" | tr -d '\r')
              if [ "$days_to_add" -lt 7 ]; then #Mon-Sat contents
                case $((row_number % 4)) in
                1) 
                  echo $m_date
                  sed_cmp "QLTITLE" "$row" "_posts/sharing/2024/wk$week_with_zeros/$m_date-qianli.md"
                  echo "_posts/sharing/2024/wk$week_with_zeros/$m_date-qianli.md"
                  ;;
                2)
                  sed_cmp "QLRECITEVERSE" "$reciterow" "_posts/sharing/2024/wk$week_with_zeros/$m_date-qianli.md"
                  sed_cmp "QLVERSE" "$row" "_posts/sharing/2024/wk$week_with_zeros/$m_date-qianli.md"
                  sed_cmp "QLD${days_to_add}VERSE" "$row" "_posts/daily/2024/wk$week_with_zeros/$wkly_date-daily.md"
                  sed_cmp "QLD${days_to_add}VERSE" "$row" "_posts/weekly/2024/$wkly_date-wk$weeks_to_add.md"                  
                  ;;
                3)
                  trimmedlink="http$( [[ $row == *http* ]] && echo ${row##*http} || echo "" )"
                  sed_cmp "QLLINK" "$trimmedlink" "_posts/sharing/2024/wk$week_with_zeros/$m_date-qianli.md"
                  ;;
                esac
              else #Sunday contents
                case $((row_number % 4)) in
                1) 
                  echo $m_date
                  sed_cmp "QLREVIEWTITLE" "$row" "_posts/daily/2024/wk$week_with_zeros/$wkly_date-daily.md"
                  sed_cmp "QLREVIEWTITLE" "$row" "_posts/weekly/2024/$wkly_date-wk$weeks_to_add.md"
                  ;;
                2)
                  trimmedQLRlink="http$( [[ $row == *http* ]] && echo ${row##*http} || echo "" )"
                  sed_cmp "QLREVIEWLINK" "$trimmedQLRlink" "_posts/daily/2024/wk$week_with_zeros/$wkly_date-daily.md"
                  sed_cmp "QLREVIEWLINK" "$trimmedQLRlink" "_posts/weekly/2024/$wkly_date-wk$weeks_to_add.md"
                  ;;
                3)
                  trimmedQLTlink="http$( [[ $row == *http* ]] && echo ${row##*http} || echo "" )"
                  sed_cmp "QLTESTLINK" "$trimmedQLTlink" "_posts/daily/2024/wk$week_with_zeros/$wkly_date-daily.md"
                  sed_cmp "QLTESTLINK" "$trimmedQLTlink" "_posts/weekly/2024/$wkly_date-wk$weeks_to_add.md"
                  ;;
                esac
              fi
            done
            mv temp.md xiv.md
            #git add -A
            #git commit -m "Add untracked and modified files"
            #git push
          #fi
