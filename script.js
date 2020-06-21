var doc = new jsPDF();
var id = 1;
var cueId = [0];
var noteNum =[1];
var maxCue = 6;
var basic_paper_f ="<div class=\"paper\" id=\"page"
var basic_paper_b ="\"><div class=\"paper-block top selectable\"> <div class=\"big-title text-box\" contenteditable=\"true\">title</div> </div> <div class=\"paper-block cue\"> <div class=\"inner-block\">  </div> </div> <div class=\"paper-block notes\"> <div class=\"inner-block\"> <p class=\"note-row text-box selectable\" contenteditable=\"true\">note</p> </div> </div> <div class=\"paper-block summary\"></div> </div>";
var basic_cue_f ="<div class=\"cue-row\" id=\"cue";
var basic_cue_m = "\">";
var basic_cue_b = "</div>";


function deltePage(){
  $("#page"+id).remove();
  id--;
  cueId.pop();
  noteNum.pop();
  $(".tooltip").remove();
  alert("刪除成功");
}
function getPaper(){
  id++;
  cueId.push(0);
  noteNum.push(1);
  return basic_paper_f+id+basic_paper_b;
}
function getCue(content,page){
  if(cueId[page-1]<maxCue){
    cueId[page-1]++;
    return basic_cue_f+cueId[page-1]+"a"+page+basic_cue_m+content+basic_cue_b;
  }else{
    return "";
  }
}
var maxNote = 6;
function getNote(page){
  if(noteNum[page-1]<maxNote){
    noteNum[page-1]++;
    return "<p class=\"note-row text-box selectable\" contenteditable=\"true\">note</p>";
  }else{
    return "";
  }
  
}

var isToggled = false;

$(".go-up").on('click',function(){
  if(!isToggled){
    $(".edit-con").css({bottom:"-100px"});
    isToggled = true;
  }else{
    $(".edit-con").css({bottom:"0px"});
    isToggled = false;
  }
});


$('body').css('overflow-y', 'scroll');
$(".back-con").on('click',".paper-block.top",function(){
  $(this).removeClass('selectable');
});
$(".back-con").on('click',".note-row",function(){
  $(this).removeClass('selectable');
});
$(".back-con").on('focusout',".text-box",function(){
  $(this).parent(".paper-block").addClass('selectable');
  if($(this).text()==""){
      $(this).text("請輸入文字");
    }
});
$(".back-con").on('focusout',".note-row.text-box",function(event){
  $(this).addClass('selectable');
  if($(this).text()==""){
      $(this).text("請輸入文字");
    }
});
var tooltip_content = "cue";
$("body").on('click',function(event){
  var posTip = getPositionByName(".tooltip");
  var posNote = getPositionByName(".paper-block.notes");
  var noteW = $(".paper-block.notes").width();
  var x = event.originalEvent.clientX;
  var y = event.originalEvent.pageY;
  // console.log("clientY="+y);
  // console.log(event);
    if(x>posNote.x&&x<posNote.x+noteW){
        console.log("進來了");
        if(y>posTip.y&&y<posTip.y+50){
          console.log("戳到了");
          var cue = getCue(tooltip_content,onPage);
          tooltip_content="cue";
          console.log(cue);
          $("#page"+onPage+" >.paper-block.cue > .inner-block").append(cue);
        }
    }else{
      tooltipRetreat();
    }
})
$(".back-con").on('keyup',".big-title.text-box",function(event){
  var text = $(this).text();
  // console.log("length:"+text.length);
  if(text.length>15){
    $(this).blur();
    $(this).text(text.substr(0,15));
  }
});
//**工具列開始
$(".add-newpage").on('click',function(){
  $(".paper-con").append(getPaper());
  alert("新增成功");
});
$(".remove-page").on('click',function(){
  if(id>1){
    var isDeleting = confirm("確定要刪除嗎?");
    if(isDeleting){
      deltePage();
    }
  }else{
    alert("已經只剩一頁啦");
  }
});

$(".save-pdf").on('click',function(){
  html2canvas(document.getElementById("page"+onPage),{
    scale: 5,
    onrendered:function(canvas){
        var imgData = canvas.toDataURL("image/png",1);
        var doc = jsPDF({
         orientation: 'p',
         unit: 'mm',
         format: 'a4'
        });
        doc.addImage(imgData,'PNG',0,0,210,297);
        doc.save('page'+onPage+'.pdf');
    }
  });
});
$(".add-note").on('click',function(){
  var note = getNote(onPage);
  console.log(note);
  $(".paper#page"+onPage+">.paper-block.notes>.inner-block").append(note);
});
//**工具列結束

//**取得選取範圍
$(".back-con").on('click',".note-row",function(event){
  if (typeof window.getSelection != 'undefined') {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    tooltipRetreat();
    var pos = getPositionByElem(this);
    // console.log(pos);
    
    var startOffset = range.startOffset;
    var endOffset = startOffset + range.toString().length - 1;
    slct=endOffset-startOffset;
    // tooltipRetreat();
    
    if(endOffset>=startOffset){
      // console.log(sel.toString());
      tooltip_content=sel.toString();
      var off =(startOffset+endOffset)*6;
      $(".back-con").append("<div class=\"tooltip\"><div class=\"tip-name\">標記</div></div>");
      $(".tooltip").css({top:pos.y-50,left:pos.x+ off,display: "block"});
      console.log("Selection starts at: " + startOffset);
      console.log("Selection ends at: " + endOffset);
    }
    }
  
});
var onPage = 1;
$(".back-con").on('click',".paper",function(){
  var str_id = $(this).attr('id');
  str_id = str_id.replace("page","");
  onPage=parseInt(str_id);
  console.log("on : "+onPage);
});

function tooltipRetreat(){
  $(".tooltip").remove();
}
function getPositionByName(elemName){
  var elem = document.querySelector(elemName);
  var position = getPosition(elem);
  return position;
}

function getPositionByElem(elem){
  var position = getPosition(elem);
  return position;
}

function getPosition (element) {
  var x = 0;
  var y = 0;
  while ( element ) {
    x += element.offsetLeft - element.scrollLeft + element.clientLeft;
    y += element.offsetTop - element.scrollLeft + element.clientTop;
    element = element.offsetParent;
  }

  return { x: x, y: y };
}