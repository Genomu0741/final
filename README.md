# 前端期末專題:康乃爾筆記產生器
#### 工科海洋 B0750519 陳庭賢
###### tags: `程式專案` `前端`
## 大綱
- 更新
- 構想
- 操作方式
- 使用的技術
- 參考資料

## 更新
version 1.0
## 啟發與構想
> 上大學之後，要吸收的知識越來越龐雜，有時候單純的抄寫的學習效果有限。
> 在二上充斥著系上各種不同領域必修的我，那時選擇使用**康乃爾筆記法**。

![](https://i.imgur.com/1gCIz1r.jpg)
### 康乃爾筆記法介紹
他的特色是會把紙張分成三塊區域
**筆記區**、**整理區**、**摘要區**
筆記區可以順著老師上課內容紀錄比較細瑣的東西。
整理區則是在經過理解、解構、連結之後萃取出的關鍵字詞。
最後，可以再課後找時間簡化筆記區內容放在摘要區。

### 逐漸數位化的課堂
大學跟高中最大的差別，就在紀錄資訊的載體。
很多大學生會用數位產品來上課甚至筆記，但是康乃爾筆記法仍未有一個數位的替代品。
有時候桌子又很小，沒空間放紙筆或資料夾，加上環保以及方便建檔等原因，
做出數位化的筆記方式，對我來說變得相當重要。

#### 於是就用這次前端程式設計的期末專題來做吧

### 架構與模式
簡單來說就是數位版的康乃爾筆記，主要的目標是可以直覺性地記筆記。
特別想做的功能是可以新增、刪除頁數、存成pdf檔。
畫面上大致上分為兩區：筆記紙、功能列
## 操作方式
### 筆記紙
#### 標題
點擊標題列就可以編輯了。特別注意標題目前是設15個字為上限。
#### 筆記
一樣點擊就可以編輯了，但如果打超出範圍會被縮起來。
一列為一單位(要增加請見功能列)，大概可以塞3行左右的字。
反白選取可以進行關鍵字標註。
#### 整理
整理區只能透過筆記區進行關鍵字標註。
#### 摘要
摘要本來的設計就是日後再寫的，所以不需要及時打上去，所以這裡無法編輯。
可以存檔之後，再找軟體填上去，或是印出來，在某個空閒的課後用筆來加深印象。
### 功能列
四大功能：
- 增加:尾頁再加一頁
- 刪減:把尾頁刪除
- 存檔:存成pdf下載
- 筆記:點了某頁之後在該頁新增一列筆記

## 使用的技術
> 沒有使用任何模板或boostrap，純手刻
> javaScript的部分用了jquery、jspdf、html2canvas

### 模組化的設計
這次的很多元素都會重複利用到，最明顯的就是**筆記會有很多頁**
筆記頁內部的欄位又有一些相似性，可以從我的pug看出我的元素架構

```pug=
.back-con
  .paper-con
    .paper#page1
      .paper-block.top.selectable
        .big-title.text-box(contenteditable="true") title
      .paper-block.cue
        .inner-block
      .paper-block.notes
        .inner-block
          p.note-row.text-box.selectable(contenteditable="true") note
      .paper-block.summary
  .tooltip
.edit-con
  .edit-top
    .go-up
      .bar
      .bar
      .bar
  .edit-region
    .btn.add-newpage
      .btn-name 增
    .btn.remove-page
      .btn-name 刪
    .btn.save-pdf
      .btn-name 存
    .btn.add-note
      .btn-name 記
```
比較值得一提的是**contenteditable**這個屬性，
這讓我可以維持div而不用input，在擴充性來說，滿方便的，
不過後來它也為我帶來很多麻煩。

### 頁面管理資料結構：list
因為需要新增跟刪除，所以需要有適當的資料結構，我使用最簡單的作法:
#### 用page數+list來做管理。
並且把基本一頁的html拆成兩塊做參數化id管理，然後也對整理列做參數化，
**這樣都為了日後append方便**
```javascript=
var id = 1;
var cueId = [0];
var noteNum =[1];
var maxCue = 6;
var basic_paper_f ="<div class=..."
var basic_paper_b ="\"><div ...";
var basic_cue_f ="<div class=...";
var basic_cue_m = "\">";
var basic_cue_b = "</div>";
```
### 自製tooltip & 土炮反白偵測 orz
主要的想法是來自medium這個網站，它可以反白後對文字做一些事
經過一陣觀察，我發現medium是用append、remove的方式直接做在body下。
在定位的時候，利用`position:absolute`和`left: ...,top: ...`
打造好調整的tooltip不難，難的是**反白偵測**以及**取消選取**...
```javascript=
$(".back-con").on('click',".note-row",function(event){
  if (typeof window.getSelection != 'undefined') {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var pos = getPositionByElem(this);
    
    var startOffset = range.startOffset;
    var endOffset = startOffset + range.toString().length - 1;
    
    // ...
    
    if(endOffset>=startOffset){
    
      tooltip_content=sel.toString();
      var off =(startOffset+endOffset)*6;
      $(".back-con").append(tooltipHTML);
      $(".tooltip").css({top:pos.y-50,left:pos.x+ off,display: "block"});
    }
}
  
});
```
經過好大一番折騰才用好反白選取，總算知道何時叫tooltip出來了，
#### 然後要怎麼請他回去比較適當呢?
還真的沒有想像中的簡單，我一度掙扎著想去用模板，但感覺好麻煩(???)。
我自己想出土炮做法是取得滑鼠點擊的x,y判斷是否在tooltip或筆記列區域。

```javascript=
$("body").on('click',function(event){
  var posTip = getPositionByName(".tooltip");
  var posNote = getPositionByName(".paper-block.notes");
  var noteW = $(".paper-block.notes").width();
  var x = event.originalEvent.clientX;
  var y = event.originalEvent.pageY;
    if(x>posNote.x&&x<posNote.x+noteW){
        // console.log("進來了");
        if(y>posTip.y&&y<posTip.y+50){
          // console.log("戳到了");
          var cue = getCue(tooltip_content,onPage);
          tooltip_content="cue";
          console.log(cue);
          $("#page"+onPage+" >.paper-block.cue > .inner-block").append(cue);
        }
    }else{
      tooltipRetreat();
    }
})
```
## 參考資料
看過的我都丟一下
- [使用 Javascript 取得元素的座標](https://andyyou.github.io/2015/04/07/get-an-element-s-position-by-js/)
- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [jsPDF doc](http://raw.githack.com/MrRio/jsPDF/master/docs/)
- [試玩 CSS custom scrollbar](https://noootown.wordpress.com/2016/01/23/css-custom-scrollbar/)
- [How to use contenteditable attribute](https://www.triplet.fi/blog/how-to-use-contenteditable-attribute/)
- [解決jspdf各種中文亂碼](https://www.itread01.com/content/1545386776.html)
- [On Text Highlight Event](https://stackoverflow.com/questions/3731328/on-text-highlight-event)
- [contenteditable 元素做簡易 get/set value](https://medium.com/@z3388638/%E5%A6%82%E4%BD%95%E9%87%9D%E5%B0%8D-contenteditable-%E5%85%83%E7%B4%A0%E5%81%9A%E7%B0%A1%E6%98%93-get-set-value-%E4%BB%A5-react-%E7%82%BA%E4%BE%8B-bbdf4d89c143)
- [W3schools tooltip](https://www.w3schools.com/css/css_tooltip.asp)
- [不使用 JS 實現可點擊的 Tooltip](https://medium.com/@miahsuwork/css-%E5%8F%AF%E9%BB%9E%E6%93%8A%E7%9A%84-tooltip-23f7fe8163e4)
- [Position of selection in javascript](https://stackoverflow.com/questions/17427973/position-of-selection-in-javascript)
- [Get the position of a div/span tag
](https://stackoverflow.com/questions/288699/get-the-position-of-a-div-span-tag)
- [動態事件綁定](http://skaih.logdown.com/posts/712464-jquery-click-on-the-where-different)
- [JS小學堂｜HTML to PDF轉存頁面](https://medium.com/anna-hsaio-%E5%89%8D%E7%AB%AF%E9%96%8B%E7%99%BC%E8%A8%98/js%E5%B0%8F%E5%AD%B8%E5%A0%82-html-to-pdf%E8%BD%89%E5%AD%98%E9%A0%81%E9%9D%A2-fa8925b75c3d)