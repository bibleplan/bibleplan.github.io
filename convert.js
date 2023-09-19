function convertToDate()
{
    var inputText = document.getElementById("input").value;
    var lines = inputText.split('\n');
    var language = "language: Chinese";
    var categoryText = "categories: daily";
    var layout = "layout: daily"
    var title = "";
    var dateText = "";
	var content = "";
	var isMetaData = false;
    var dateInfo
	
	for (var i = 0; i < lines.length; i++)
    {
		if (lines[i].indexOf("---") >= 0)
			isMetaData = !isMetaData
        else if (lines[i].indexOf("language:") >= 0)
            language = lines[i];
        else if (lines[i].indexOf("categories:") >= 0)
            categoryText = lines[i];
        else if (lines[i].indexOf("layout:") >= 0)
            layout = lines[i];
        else if (lines[i].indexOf("date:") >= 0)
        {
            dateText = lines[i].substring(6).trim();
            dateInfo = getDateInfo(dateText)
        }
        else if (lines[i].indexOf("title:") >= 0)
        {
            if (lines[i].indexOf("Week") > 0) // English
                title = lines[i].replaceAll('"', '').split(": ");
            else if (lines[i].indexOf("每日靈修") > 0)
                title = lines[i].replaceAll('"', '').split("每日靈修：");
            else
                title = lines[i].replaceAll('"', '').split(" ");
            title = title[title.length - 1];
        }
		else if (!isMetaData && lines[i].indexOf("---") < 0)
        {
            if (lines[i].indexOf('BibleLinks') >= 0)
                content += '\r\n{% include BibleLinks' + dateInfo.cycle + '.html %}\r\n'
            else
			    content += lines[i] + "\r\n"
        }
    }

    var result = "";
    var category = categoryText.split(' ')[1]
    var titleText = "每日靈修：" + title
    var permalinkRoot = '/sharing/zhuolin/'
    if (category == "daily" && language.indexOf("English") >= 0)
    {
        titleText = '"' + dateInfo.cycle + '-' + (dateInfo.cycle+1) + ' Week ' + dateInfo.numberOfWeek + ' Day ' + dateInfo.numberOfDay + ': ' + title + '"'
        permalinkRoot = '/en/' + category + '/'
    } else if (category == "daily" && language.indexOf("Chinese") >= 0) {
        titleText = '第' + dateInfo.numberOfWeek + '週 第' + dateInfo.numberOfDay + '天 ' + title
        permalinkRoot = '/' + category + '/'
    }

    if (layout.indexOf("daily") >= 0)
        layout = "layout: daily" + dateInfo.cycle;

    result += '---\r\n'
            + "cycle: " + dateInfo.cycle + "\r\n"
            + layout + "\r\n"
            + categoryText + "\r\n"
            + language + "\r\n"
            + "title: " + titleText + "\r\n"
            + "date: " + dateInfo.dateText + "\r\n"
            + "weekNum: " + dateInfo.numberOfWeek + "\r\n"
            + "dayNum: " + dateInfo.numberOfDay + "\r\n"
            + "permalink: " + permalinkRoot + dateInfo.cycle + "/wk" + dateInfo.numberOfWeek + "-day" + dateInfo.numberOfDay + "-" + category + ".html\r\n"
            + "---\r\n"

    document.getElementById("markup").value = result + content;
}

function IsDigit(charCode)
{
	var charCodeZero = "0".charCodeAt(0);
	var charCodeNine = "9".charCodeAt(0);
	return charCode >= charCodeZero && charCode <= charCodeNine;
}
function normalize(inputText)
{
    var result = useChinesePunctuation(inputText).replace(/周/g, "週").replace(/週圍/g, "周圍");

    result = useRomanCommaForVerses(result);
    result = ConvertNumberedList(result);
	result = result.replace(/^-/gm, "—");
	var arr = result.split("：");
	var st = "";
	for (i = 0; i < arr.length - 1; i++)
	{
		if (IsDigit(arr[i].charCodeAt(arr[i].length - 1)) && IsDigit(arr[i+1].charCodeAt(0)))
		    st += arr[i] + ":";
		else
		    st += arr[i] + "：";
	}
	result = st + arr[arr.length - 1];
    if (!document.getElementById("keepSpace").checked)
		result = result.replace(/ /g, "");
    result = appendEndingSpaces(result);

    return result;
}

function useChinesePunctuation(inputText)
{
	if (document.getElementById("english").checked)
		return inputText;
	
    var result = inputText.replace(/,/g, "，");
    return result.replace(/[?]/g, "？")
                .replace(/:/g, "：")
                .replace(/;/g, "；")
                .replace(/!/g, "！")
                .replace(/（/g, "(")
                .replace(/）/g, ")");
}

function appendEndingSpaces(txt)
{
    var result = "";
	
    lines = txt.split("\n");
    for (i=0; i<lines.length; i++) {
        result += lines[i];
    	if (lines[i].length > 0)
            result += "  ";
        result += "\r\n";
    }
	
    return result;
}

function useRomanCommaForVerses(txt)
{
    var regex = /[0-9]：[0-9]/g;
    var result = "";

    do {
        //console.log("txt: " + inputText);
        index = txt.search(regex);
        if (index >= 0) {
            result += txt.substring(0, index + 1) + ":";
            //console.log("result: " + result);
            txt = txt.substring(index + 2);
        }
    } while (index >= 0);
	
    return result + txt;
}

function convertBulletPoints()
{
    var inputText = document.getElementById("input").value;
    var result = "";
    var bullet = "+";

    lines = inputText.split("\n");
    for (i=0; i<lines.length; i++) {
        if (lines[i].length > 0) {
            index = lines[i].indexOf(bullet);
            line = index >= 0 ? lines[i].substring(index + 1, lines[i].length).trim() : lines[i];
            result += "    <li>" + line.replace(/[ `]/g, "") + "</li>";
            if (lines[i].length > 0) result += "\r\n";
        }
    }

    document.getElementById("markup").value = result;
}

function normalizeLineEnding()
{
    var inputText = document.getElementById("input").value;
    var result = "";

    lines = inputText.split("\n");
    for (i=0; i<lines.length; i++) {
        result += lines[i];
        if (lines[i].length > 0)
            result += "  ";
        result += "\r\n";
    }

    document.getElementById("markup").value = result;
}

function getNumberOfWeek(dateText)
{
    var date = new Date(dateText);
    var time = date.getTime();
    // Calculate the week number by dividing the time by the number of milliseconds in a week
    var weekNumber = Math.ceil(((time - new Date(date.getFullYear(), 0, 1).getTime()) / 86400000) / 7);
    return weekNumber + (date.getFullYear() % 2) * 52;
}

function getDateInfo(dateText)
{
    var date = new Date(dateText.replaceAll('-', '/'));
    var year = date.getFullYear();
    var month = date.getMonth();
    var monthText = month + 1;
    if (month < 9)
        monthText = "0" + monthText;
    var day = date.getDate();
    var dayText = day;
    if (day < 10)
        dayText = "0" + dayText;
    dateText = year + "-" + monthText + "-" + dayText;
    var cycle = year - year % 2;
    var numberOfWeek = getNumberOfWeek(date);
    var numberOfWeekText = numberOfWeek;
    if (numberOfWeek < 10)
	numberOfWeekText = "00" + numberOfWeekText;
    else if (numberOfWeek < 100)
	numberOfWeekText = "0" + numberOfWeekText;
    var numberOfDay = date.getDay();
    if (numberOfDay == 0)
        numberOfDay = 7;

    var DateInfo = {
        dateText: dateText,
        numberOfWeek: numberOfWeek,
	numberOfWeekText: numberOfWeekText,
        numberOfDay: numberOfDay,
        cycle: cycle
    }

    return DateInfo;
}

function getQianBinSharingTemplate()
{
    var inputText = document.getElementById("input").value;
    var dateInfo = getDateInfo(inputText.split(' ')[0]);
    var title = inputText.split(' ')[1];
    var result = "---\r\n" +
                "cycle: " + dateInfo.cycle + "\r\n" +
                "categories: sharing\r\n" +
                "layout: sharing\r\n" +
                "date: " + dateInfo.dateText + "\r\n" +
                "title: \"神學梳理：" + title + "\"\r\n" +
                "weekNum: " + dateInfo.numberOfWeek + "\r\n" +
                "dayNum: " + dateInfo.numberOfDay + "\r\n" +
                "permalink: /sharing/2022/wk" + dateInfo.numberOfWeek + "-day" + dateInfo.numberOfDay + "-sharing.html\r\n" +
                "---\r\n" +
                "\r\n" +
                "[" + title + "](https://eccseattle.github.io/media/sharing/" + dateInfo.cycle + "/wk" + dateInfo.numberOfWeekText + "/" + dateInfo.dateText + "-bin.m4a)\r\n" +
                "\r\n" +
                "`小錢`\r\n" +
                "\r\n";

    document.getElementById("markup").value = result;
}

function getZhuolinSharingTemplate()
{
    var inputText = document.getElementById("input").value;
    var firstLine = inputText.split("\n")[0].trim();
    var dateText = inputText.split("\n")[1].trim();
    var dt = new Date(dateText.replace(/-/g, "/"));
    var dayOfWeek = dt.getDay();
    var day = (dt.getDate() < 10 ? "0" : "") + dt.getDate();
    var monthNum = dt.getMonth() + 1;
    var month = (monthNum < 10 ? "0" : "") + monthNum;
    var title = firstLine.split(' ').slice(-1)[0];
    var result = "---\r\n";
    result += "layout: sharing\r\n";
    result += "date: 2020-" + month + "-" + day + "\r\n";
    result += "title: \"每日靈修：" + title + "\"\r\n";
    result += "categories: sharing Zhuolin\r\n";
    result += "weekNum: \r\n";
    result += "dayNum: " + dayOfWeek + "\r\n";
    result += "permalink: /sharing/zhuolin/2020/wk-day" + dayOfWeek + "-sharing.html\r\n";
    result += "author: Zhuolin\r\n";
    result += "cycle: 2020\r\n";
    result += "---\r\n";
    
    result += normalize(inputText);
    result = result.replace(/\(Zhuolin\)/ig, "`Zhuolin`")
				   .replace(/（Zhuolin）/ig, "`Zhuolin`");
	if (result.indexOf("`Zhuolin`") < 0)
		result = result.replace(/^Zhuolin/gm, "`Zhuolin`");
	
    document.getElementById("markup").value = result;
}

function getZhuolinSharingTemplate2()
{
    var inputText = document.getElementById("input").value;
    var dateInfo = getDateInfo(inputText.split(' ')[0]);
    var title = inputText.split(' ')[1];

	var result = "---\r\n" +
				"layout: sharing\r\n" +
				"date: " + dateInfo.dateText + "\r\n" +
				"title: \"親子導讀：" + title + "\"\r\n" +
				"categories: sharing Zhuolin\r\n" +
				"weekNum: " + dateInfo.numberOfWeek + "\r\n" +
				"dayNum: " + dateInfo.numberOfDay + "\r\n" +
				"permalink: /sharing/zhuolin/" + dateInfo.cycle + "/wk" + dateInfo.numberOfWeek + "-day" + dateInfo.numberOfDay + "-sharing2.html\r\n" +
				"author: Zhuolin\r\n" +
				"cycle: 2022\r\n" +
				"---\r\n";
	document.getElementById("markup").value = result;
}

function getZhuolinSharingTemplate3()
{
	var result = "---\r\n" +
				"layout: sharing\r\n" +
				"date: 2022-\r\n" +
				"title: \"親子導讀：\"\r\n" +
				"categories: sharing Zhuolin\r\n" +
				"weekNum: \r\n" +
				"dayNum: \r\n" +
				"permalink: /sharing/zhuolin/2022/wk-day-sharing3.html\r\n" +
				"author: Zhuolin\r\n" +
				"cycle: 2022\r\n" +
				"---\r\n" +
				"\r\n" +
				"1. 打印經文。  \r\n" +
				"2. 一起禱告開始。  \r\n" +
				"3. 讓孩子讀，勾畫重點，紀錄下自己想問的問題。  \r\n" +
				"4. 討論時間，請孩子分享自己的問題。討論、紀錄。經文引導列在下面。  \r\n" +
				"5. 應用分享（不可缺）。應用部分也列在下面。  \r\n" +
				"6. 禱告結束。\r\n" +
				"\r\n" +
				"#### 今天的經文可以引導的方向：\r\n" +
				"\r\n" +
				"\r\n" +
				"\r\n" +
				"#### 應用部分\r\n" +
				"\r\n" +
				"1. 今天的經文和後面的分享討論，給你印象最深的是哪一點？  \r\n" +
				"2. 如果反省一下你自己的生命，你認識到你自己的什麼掙扎，是跟沒有意識到與上面的1中所分享的相關的。  \r\n" +
				"3. 從這一點你有什麼思考？你覺得遇到同樣的掙扎的時候，你可以怎樣提醒自己？\r\n" +
				"\r\n" +
				"琢琳\r\n" +
				"\r\n" +
				"附：[親子導讀簡介](https://bibleplan.github.io/ParentChild-BibleStudyIntro.html)\r\n";
	document.getElementById("markup").value = result;
}
