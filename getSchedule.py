bookCh = "創世記"
bookEn = "Genesis"
bookEn2 = "GEN"

psalmsCh = "詩篇"
psalmsEn = "Psalms"
psalmsEn2 = "PSA"

dailyVerses = ["1",
                "2",
                "3.1-5.12",
                "5.13-7.26",
                "8",
                "9-10",
                "11-12",
                "13",
                "14-15",
                "16-17",
                "18-19",
                "20-21",
                "22-23",
                "24"]

dailyVerses2 = ["1",
                "2",
                "3",
                "5",
                "8",
                "9-10",
                "11-12",
                "13",
                "14-15",
                "16-17",
                "18-19",
                "20-21",
                "22-23",
                "24"]

dailyVerses = [
    "1.1-2.3",
    "2.4-4.26",
    "5.1-6.8",
    "6.9-9.29",
    "10.1-11.9",
    "11.10-32",
    "12",
    "13-14",
    "15-16",
    "17",
    "18.1-15",
    "18.16-19.38",
    "20-21",
    "22-23",
    "24-25.11",
    "25.12-18",
    "25.19-26.35",
]

dailyVerses2 = [
    "1",
    "2",
    "5",
    "6",
    "10",
    "11.10-32",
    "12",
    "13-14",
    "15-16",
    "17",
    "18.1-15",
    "18",
    "20-21",
    "22-23",
    "24",
    "25.12-18",
    "25",
]

startIndex = 1
startPsalmsIndex = 1

resultStr = ""

for i in range(len(dailyVerses)):
    resultStr += "  - index: " + str(startIndex + i) + "\n"
    resultStr += "    verses:\n"
    resultStr += "    - titleCh: " + bookCh + ' ' + dailyVerses[i] + '\n'
    resultStr += "    - titleEn: " + bookEn + ' ' + dailyVerses[i] + '\n'
    resultStr += "    - verseGB: " + bookEn + '.' + dailyVerses[i] + '\n'
    resultStr += "    - verseYV: " + bookEn2 + '.' + dailyVerses2[i] + '\n'
    resultStr += "    - titleCh: " + psalmsCh + ' ' + str(startPsalmsIndex + i) + '\n'
    resultStr += "    - titleEn: " + psalmsEn + ' ' + str(startPsalmsIndex + i) + '\n'
    resultStr += "    - verseGB: " + psalmsEn + '.' + str(startPsalmsIndex + i) + '\n'
    resultStr += "    - verseYV: " + psalmsEn2 + '.' + str(startPsalmsIndex + i) + '\n\n'

print(resultStr)
