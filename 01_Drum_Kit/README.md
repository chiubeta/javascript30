01_Drum_Kit
-----------
[DEMO](http://chiubeta.com/javascript30/01_Drum_Kit/index.html)
### Introduction
A keyboard drum kit that allow you to play the drums on the screen with keyboard. You can simply play the drums or record your own rhythm. Also, there are a lot of rhythms that others recorded beside. Let's music!

### Strategy

**keyboard 發聲原理：** 

> 在 HTML 上放置9個 audio 標籤的音效檔，每一個分別給予一個 data-key 的 attribute ，該值為 會觸發這個音效的按鍵的 ASCII 。
> 當使用者按下正確的 key 時，用 keypress  event 來偵測，找到那個鍵對應的ASCII，可順勢找到負責這個 key 的 audio ，使用 audio.play() 即可播放。


**記錄節奏的方式：**

>  recordStartTime = 按下錄音鍵的時間 
>     rhythm = 一個 array ， 每按下一個音， 就把那個音的 keycode(ASCII)、按下時間點 記錄下來，包成一個 object ，push 進去 rhythm。
>     按下停止錄音之後，再按播放鍵。將 rhythm 內的 object 一個個 shift 出來，每一個 object 調用一個 setTimeout function，時間就訂為：(這個 key 按下的時間點 - recordStartTime)，一樣有 Keycode 就可以發聲。

**儲存節奏的方式：**

> 建一個 MySQL 資料表， column 有 id、creator、rhythm、recordTime。
> 透過前端一個 input filed 輸入 creator 。
> recordTime 就是 recordStartTime。
> rhythm 的格式大概長這樣：[ { keycode: 65, timestamp: 142358445695 }, { keycode: 78, timestamp: 142358447952 } ] ，裡頭的 object 不確定有多少個，透過以下的方式，存進資料庫，並且能夠原封不動取回：
> 
> JSON.stringify(rhythm) → MySQL 用 text 格式來存 → json_encode($row) → JSON.parse(result.rhythm);

**讀別人節奏的方式：**

> load 好網頁就直接跑 loadButton()，將資料庫裡面有幾個 rhythm 就在 HTML 產生幾個 button，並給予 data-id 存放它們本身的 id 。
> 當使用者按到某個 button 之後，會直接取 data-id 的值來搜尋資料庫，找到對應的 rhythm，之後將這個物件讀回 js ，丟進去 rhythm 的陣列，按下播放鍵即可播放。

**節拍器實作(可調節快慢)：**

> 用滑鼠點擊螢幕上的鍵，可以開始、停止節拍器。
> 建立一個 metronome = { }，實作 hash ，key 的部分是 keycode ，value的部分是 setInterval 的回傳值。
> 一樣 click 是個 event ，可以抓到是點到哪一個鍵，一樣抓出 keycode 。
> 使用 setInterval 來製造節拍器效果，為了要能夠停止，要將回傳值記錄在 metronome 中。
> 調節快慢的部分，用 jQuery UI 產生一個 slider ，用內建的 change event ，將 slider 的 value ，帶入到 setInterval 的時間間隔內，即可製造用 slider 來控制節拍器快慢的效果。

### Take notes

 1. 節拍器的實作部分，用 array 也可以做，但如果是存 keycode 65，前面就會有65格被浪費掉，因此採用 object 來實作 hash 或者 dictionary。
 2. 比較兩種操作 DOM 的方法：
 3. `document.querySelector('audio[data-key="${keyCode}"]')`
 4. `$('audio[data-key="${keyCode}"]')`
 5. DOM 取出來，css的操作是 classList.add / classList.remove。
 6. 以後改用 $(XXX).attr("data-id") 來取得 id，別再把 id 放在 id 了。
 7. 考慮不要每次需要 audio 、 key 的時候，都再搜尋一次 DOM ，既然只有九組，乾脆一開始就九組抓好放在 array 方便調用。
